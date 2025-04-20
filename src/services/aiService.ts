import axios from 'axios';
import geminiService from './geminiService';

// AI service for generating property NFT images
class AIService {
  private static instance: AIService;
  private huggingfaceApiKey: string = process.env.HUGGINGFACE_API_KEY || '';
  private geminiApiKey: string = process.env.GEMINI_API_KEY || '';
  private apiUrl: string = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
  private maxRetries: number = 3;
  private creditLimitExceeded: boolean = false;
  
  private constructor() {
    // Try to load API keys from window.ENV if available (for client-side)
    if (typeof window !== 'undefined' && (window as any).ENV) {
      this.huggingfaceApiKey = (window as any).ENV.HUGGINGFACE_API_KEY || this.huggingfaceApiKey;
      this.geminiApiKey = (window as any).ENV.GEMINI_API_KEY || this.geminiApiKey;
    }
    
    // Log API key status (without revealing the actual keys)
    console.log(`HuggingFace API Key status: ${this.huggingfaceApiKey ? 'Available' : 'Missing'}`);
    console.log(`Gemini API Key status: ${this.geminiApiKey ? 'Available' : 'Missing'}`);
    
    // Initialize Gemini service with API key if available
    if (this.geminiApiKey) {
      geminiService.setApiKey(this.geminiApiKey);
    }
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async makeRequest(
    prompt: string, 
    style: string = 'Default', 
    era: string = 'Not specified', 
    mood: string = 'Nostalgic',
    isPreview: boolean = false,
    retryCount = 0
  ): Promise<string> {
    const requestId = Math.random().toString(36).substring(2, 15);
    console.log(`[${requestId}] Attempting image generation for prompt: ${prompt}`);
    
    try {
      // If we already know credits are exceeded, don't attempt the API call
      if (this.creditLimitExceeded) {
        console.log('Monthly API credits already known to be exceeded, using fallback image');
        return this.getFallbackImage(prompt);
      }
      
      // Use HuggingFace API key for image generation
      const apiKey = this.huggingfaceApiKey;
      
      // Validate API key before making request
      if (!apiKey) {
        console.error('Missing HuggingFace API key for image generation');
        return this.getFallbackImage(prompt);
      }
      
      // Add uniqueness factors to prevent duplicate images
      const uniqueId = Math.floor(Math.random() * 2147483647); // Random seed within int32 range
      const uniqueNoise = Math.random().toString(36).substring(2, 10);
      
      // First, enhance the prompt using Gemini API if available
      console.log(`[${requestId}] Enhancing prompt with Gemini API`);
      let enhancedPrompt;
      
      try {
        // Use Gemini API to enhance the prompt
        enhancedPrompt = await geminiService.enhancePrompt(prompt, style, era, mood);
        console.log(`[${requestId}] Prompt enhanced successfully with Gemini API`);
      } catch (error) {
        console.error(`[${requestId}] Error enhancing prompt with Gemini API:`, error);
        // Fall back to basic prompt enhancement if Gemini API fails
        enhancedPrompt = `Create a detailed, high-quality visualization of a real estate property. 
        Style: ${style}. Era: ${era}. Mood: ${mood}. 
        ${prompt} 
        Unique identifier: ${uniqueNoise}.
        Focus on architectural details, lighting, and surrounding environment.
        Ensure the image is crisp, clear, and professionally composed with proper proportions.`;
      }
      
      // Add unique identifier to the enhanced prompt to prevent duplicates
      enhancedPrompt = `${enhancedPrompt} (Unique identifier: ${uniqueNoise})`;
      
      console.log(`[${requestId}] Generating image with seed: ${uniqueId}`);
      
      // Set quality parameters based on whether this is a preview or final image
      // Adding a timestamp to ensure uniqueness even with the same seed
      const timestamp = Date.now();
      const uniqueSeedWithTime = uniqueId + (timestamp % 1000);
      
      const qualityParams = isPreview ? {
        guidance_scale: 7.0,
        num_inference_steps: 30,
        width: 768,
        height: 768,
        seed: uniqueSeedWithTime
      } : {
        guidance_scale: 9.0, // Higher guidance scale for better quality
        num_inference_steps: 75, // More steps for higher detail
        width: 1024,
        height: 1024,
        seed: uniqueSeedWithTime,
        negative_prompt: "blurry, low quality, low resolution, poorly rendered, bad anatomy, distorted, disfigured"
      };
      
      // In a real production environment, this would be a server-side call to protect the API key
      const response = await axios.post(
        this.apiUrl,
        { 
          inputs: enhancedPrompt,
          parameters: qualityParams
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: isPreview ? 30000 : 60000, // Longer timeout for final images
        }
      );

      // Check if we received a valid image response
      if (response.data && response.data.byteLength > 1000) { // Ensure we have a substantial image
        // Convert the image buffer to a base64 data URL
        const base64 = Buffer.from(response.data).toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64}`;
        
        console.log(`[${requestId}] Image generated successfully, size: ${response.data.byteLength} bytes`);
        return imageUrl;
      } else {
        console.warn(`[${requestId}] Received empty or invalid image data from API, size: ${response.data?.byteLength || 0} bytes`);
        
        if (retryCount < this.maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`[${requestId}] Retrying image generation after ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
          
          return new Promise(resolve => {
            setTimeout(async () => {
              resolve(await this.makeRequest(prompt, style, era, mood, isPreview, retryCount + 1));
            }, delay);
          });
        }
        
        return this.getFallbackImage(prompt);
      }
    } catch (error: any) {
      console.error(`[${requestId}] Error in makeRequest: ${error.message}`);
      
      // Check specifically for 402 Payment Required status
      if (error.response && error.response.status === 402) {
        console.error('API credit limit exceeded: Monthly included credits for Inference Providers have been exceeded');
        // Set flag to avoid further API calls in this session
        this.creditLimitExceeded = true;
        
        // No need to retry if we hit credit limits
        return this.getFallbackImage(prompt);
      }
      
      // Log detailed error information for debugging
      if (error.response) {
        console.error(`[${requestId}] API response status:`, error.response.status);
        console.error(`[${requestId}] API response headers:`, error.response.headers);
      }
      
      // Implement retry with exponential backoff for temporary failures
      if (retryCount < this.maxRetries && !this.creditLimitExceeded) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`[${requestId}] Retrying image generation after ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
        
        return new Promise(resolve => {
          setTimeout(async () => {
            resolve(await this.makeRequest(prompt, style, era, mood, isPreview, retryCount + 1));
          }, delay);
        });
      }
      
      // If all retries fail, use fallback image
      return this.getFallbackImage(prompt);
    }
  }

  // Enhanced fallback image selection based on property characteristics
  private getFallbackImage(prompt: string): string {
    // Convert to lowercase for consistent matching
    const promptLower = prompt.toLowerCase();
    let imageUrl = '';

    // Property type matching - checking for multiple keywords for better categorization
    if (promptLower.includes('villa') || 
        promptLower.includes('luxury') || 
        promptLower.includes('mansion') || 
        promptLower.includes('beachfront')) {
      imageUrl = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80';
    } else if (promptLower.includes('apartment') || 
               promptLower.includes('condo') || 
               promptLower.includes('flat') || 
               promptLower.includes('loft')) {
      imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
    } else if (promptLower.includes('commercial') || 
               promptLower.includes('office') || 
               promptLower.includes('building') || 
               promptLower.includes('business')) {
      imageUrl = 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80';
    } else if (promptLower.includes('retail') || 
               promptLower.includes('shop') || 
               promptLower.includes('store') || 
               promptLower.includes('mall')) {
      imageUrl = 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
    } else if (promptLower.includes('industrial') || 
               promptLower.includes('warehouse') || 
               promptLower.includes('factory') || 
               promptLower.includes('manufacturing')) {
      imageUrl = 'https://images.unsplash.com/photo-1612633501998-813f90599051?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
    } else if (promptLower.includes('historic') || 
               promptLower.includes('heritage') || 
               promptLower.includes('vintage') || 
               promptLower.includes('classic')) {
      imageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
    } else if (promptLower.includes('modern') || 
               promptLower.includes('contemporary') || 
               promptLower.includes('minimalist') || 
               promptLower.includes('sleek')) {
      imageUrl = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1753&q=80';
    } else if (promptLower.includes('mountain') || 
               promptLower.includes('cabin') || 
               promptLower.includes('chalet') || 
               promptLower.includes('retreat')) {
      imageUrl = 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
    } else {
      // Default image if no specific type is detected
      imageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80';
    }

    console.log(`Using fallback image for property type: ${imageUrl}`);
    return imageUrl;
  }

  public async generatePropertyImage(description: string): Promise<string> {
    const prompt = `A photorealistic image of a real estate property: ${description}. Architectural visualization, high quality render, professional real estate photography style.`;
    return this.makeRequest(prompt, 'Photorealistic', 'Modern', 'Serene', false);
  }

  public async generateNFTArt(
    propertyDetails: string,
    style: string = 'Default',
    era: string = 'Not specified',
    mood: string = 'Nostalgic',
    isPreview: boolean = false
  ): Promise<string> {
    console.log(`NFT Generation started - Preview mode: ${isPreview}`);
    console.log(`Parameters - Style: ${style}, Era: ${era}, Mood: ${mood}`);
    
    try {
      const timestamp = Date.now();  // Add timestamp for uniqueness
      const randomId = Math.random().toString(36).substring(2, 10);
      let enhancedDetails = `${propertyDetails} (unique ID: ${timestamp}-${randomId})`;
    
    const bedroomMatch = enhancedDetails.match(/(\d+)\s*bed(room)?s?/i);
    const bathroomMatch = enhancedDetails.match(/(\d+)\s*bath(room)?s?/i);
    const sqftMatch = enhancedDetails.match(/(\d+(?:,\d+)?)\s*sq(uare)?\s*ft/i);
    
    const features = [];
    if (bedroomMatch && !enhancedDetails.includes('bedroom')) {
      features.push(`${bedroomMatch[1]} bedrooms`);
    }
    if (bathroomMatch && !enhancedDetails.includes('bathroom')) {
      features.push(`${bathroomMatch[1]} bathrooms`);
    }
    if (sqftMatch && !enhancedDetails.includes('square feet')) {
      features.push(`${sqftMatch[1]} square feet`);
    }
    
    if (features.length > 0) {
      enhancedDetails += '. Features ' + features.join(', ') + '.';
    }
    
    // Create a more detailed base prompt
    let basePrompt = `Create a detailed, high-quality visualization of a real estate property: ${enhancedDetails}`;
    
    // Add style specification if provided
    if (style && style !== "Default") {
      basePrompt += `, in the style of ${style}`;
    }
    
    // Add era context if provided
    if (era && era !== "Not specified") {
      basePrompt += `, from the ${era} era`;
    }
    
    // Add emotional tone
    if (mood && mood !== "Default") {
      basePrompt += `, with a ${mood} mood`;
    }
    
    // Enhance with specific art direction based on property type
    if (enhancedDetails.toLowerCase().includes('luxury') || 
        enhancedDetails.toLowerCase().includes('villa') || 
        enhancedDetails.toLowerCase().includes('mansion')) {
      basePrompt += `. Elegant lighting, sophisticated composition, emphasis on architectural features and luxury amenities.`;
    } else if (enhancedDetails.toLowerCase().includes('commercial') || 
               enhancedDetails.toLowerCase().includes('office')) {
      basePrompt += `. Professional environment, productive space, sleek design, emphasis on business functionality.`;
    } else if (enhancedDetails.toLowerCase().includes('apartment') || 
               enhancedDetails.toLowerCase().includes('condo')) {
      basePrompt += `. Urban setting, clean lines, focus on efficient use of space and city views if applicable.`;
    }
    
    // Customize the NFT styling based on the selected style
    let nftStyling = "";
    
    // Add a random variation factor to ensure uniqueness
    const variations = [
      "morning light", "afternoon glow", "evening sunset", "night illumination",
      "dramatic shadows", "soft lighting", "high contrast", "muted tones",
      "vibrant colors", "pastel palette", "monochromatic scheme", "complementary colors"
    ];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    
    switch(style.toLowerCase()) {
      case 'photorealistic':
        nftStyling = `Photorealistic rendering, ${randomVariation}, high dynamic range, physically accurate materials, detailed textures, architectural photography style, 8k resolution, crystal clear details, sharp focus`;
        break;
      case 'abstract':
        nftStyling = `Abstract geometric shapes, ${randomVariation}, bold color blocks, minimalist composition, artistic interpretation of architectural elements, modern art style, precise lines`;
        break;
      case 'stylized':
        nftStyling = `Stylized illustration, ${randomVariation}, bold outlines, exaggerated features, cartoon-like quality, vibrant colors, artistic interpretation, clean edges`;
        break;
      default: // Default to digital art style for NFTs
        nftStyling = `Vibrant colors, ${randomVariation}, neon sunset lighting, retrowave style, synthwave aesthetic, gradient purple to pink background, stylized as digital art, extreme detail, 8k resolution, cinematic framing, professional CGI, ultra-high definition`;
    }
    
    // Add NFT styling with more detailed art direction and uniqueness factors
    const promptTimestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 10);
    
    // Add specific quality instructions to avoid blurry images
    const qualityInstructions = "Ultra-high definition, crystal clear details, sharp focus, no blur, professional quality, suitable for an NFT, unreal engine render";
    
    const finalPrompt = `${basePrompt}. ${nftStyling}. ${qualityInstructions}. Unique identifier: ${promptTimestamp}-${uniqueId}.`;
    
      console.log("NFT Generation enhanced prompt:", finalPrompt);
      const result = await this.makeRequest(finalPrompt, style, era, mood, isPreview);
      console.log(`NFT Generation completed successfully - Preview mode: ${isPreview}`);
      return result;
    } catch (error) {
      console.error(`NFT Generation failed - Preview mode: ${isPreview}`, error);
      // Return a local fallback image instead of throwing
      return `/images/fallback-nft.jpg`;
    }
  }
}

export default AIService.getInstance();