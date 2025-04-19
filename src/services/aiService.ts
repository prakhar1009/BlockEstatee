import axios from 'axios';

// AI service for generating property NFT images
class AIService {
  private static instance: AIService;
  private apiKey: string = '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'; // This would typically come from environment variables
  private apiUrl: string = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
  private maxRetries: number = 3;
  private creditLimitExceeded: boolean = false;
  
  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async makeRequest(prompt: string, retryCount = 0): Promise<string> {
    try {
      // If we already know credits are exceeded, don't attempt the API call
      if (this.creditLimitExceeded) {
        console.log('Monthly API credits already known to be exceeded, using fallback image');
        return this.getFallbackImage(prompt);
      }
      
      console.log('Generating image with prompt:', prompt);
      
      // Validate API key before making request
      if (!this.apiKey) {
        console.error('Missing API key for image generation');
        return this.getFallbackImage(prompt);
      }
      
      // In a real production environment, this would be a server-side call to protect the API key
      const response = await axios.post(
        this.apiUrl,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
          timeout: 30000, // 30 second timeout
        }
      );

      // Check if we received a valid image response
      if (response.data && response.data.byteLength > 100) {
        // Convert the image buffer to a base64 data URL
        const base64 = Buffer.from(response.data).toString('base64');
        return `data:image/jpeg;base64,${base64}`;
      } else {
        console.warn('Received empty or invalid image data from API');
        return this.getFallbackImage(prompt);
      }
    } catch (error: any) {
      // Check specifically for 402 Payment Required status
      if (error.response && error.response.status === 402) {
        console.error('API credit limit exceeded: Monthly included credits for Inference Providers have been exceeded');
        // Set flag to avoid further API calls in this session
        this.creditLimitExceeded = true;
        
        // No need to retry if we hit credit limits
        return this.getFallbackImage(prompt);
      }
      
      // Log detailed error information for debugging
      console.error('Error generating image:', error.message);
      
      if (error.response) {
        console.error('API response status:', error.response.status);
        console.error('API response headers:', error.response.headers);
      }
      
      // Implement retry with exponential backoff for temporary failures
      if (retryCount < this.maxRetries && !this.creditLimitExceeded) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying image generation after ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
        
        return new Promise(resolve => {
          setTimeout(async () => {
            resolve(await this.makeRequest(prompt, retryCount + 1));
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
    return this.makeRequest(prompt);
  }

  public async generateNFTArt(
    propertyDetails: string,
    style: string = 'Default',
    era: string = 'Not specified',
    mood: string = 'Nostalgic'
  ): Promise<string> {
    // Extract key property characteristics if present in the details
    const bedroomMatch = propertyDetails.match(/(\d+)\s*bed(room)?s?/i);
    const bathroomMatch = propertyDetails.match(/(\d+)\s*bath(room)?s?/i);
    const sqftMatch = propertyDetails.match(/(\d+(?:,\d+)?)\s*sq(uare)?\s*ft/i);
    
    // Build a more detailed property description
    let enhancedDetails = propertyDetails;
    
    // Add extracted features if they exist but aren't already in the prompt
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
    
    // Base prompt with enhanced property details
    let basePrompt = `Create a detailed, high-quality visualization of a real estate property: ${enhancedDetails}`;
    
    // Add style specification if provided
    if (style && style !== "Default") {
      basePrompt += `, in the style of ${style}`;
    }
    
    // Add era context if provided
    if (era && era !== "Not specified") {
      basePrompt += `, from the ${era}`;
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
    
    // Add NFT styling with more detailed art direction
    const finalPrompt = `${basePrompt}. Vibrant colors, neon sunset lighting, retrowave style, synthwave aesthetic, gradient purple to pink background, stylized as digital art for an NFT, extreme detail, 8k resolution, cinematic framing, professional CGI, unreal engine render.`;
    
    console.log("NFT Generation enhanced prompt:", finalPrompt);
    return this.makeRequest(finalPrompt);
  }
}

export default AIService.getInstance();