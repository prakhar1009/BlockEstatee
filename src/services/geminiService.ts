import axios from 'axios';

// Gemini API service for enhancing prompts
class GeminiService {
  private static instance: GeminiService;
  private apiKey: string = process.env.GEMINI_API_KEY || '';
  private apiUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Sets the API key for Gemini API
   * @param apiKey The API key to use for Gemini API
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    console.log('Gemini API key has been set');
  }

  /**
   * Enhances a user prompt for image generation using Gemini API
   * @param prompt The original user prompt
   * @param style The desired art style
   * @param era The desired historical era
   * @param mood The desired mood or emotion
   * @returns Enhanced prompt optimized for image generation
   */
  public async enhancePrompt(
    prompt: string,
    style: string = 'Default',
    era: string = 'Not specified',
    mood: string = 'Nostalgic'
  ): Promise<string> {
    try {
      // Validate API key before making request
      if (!this.apiKey) {
        console.error('Missing Gemini API key for prompt enhancement');
        return prompt; // Return original prompt if no API key
      }

      const requestId = Math.random().toString(36).substring(2, 15);
      console.log(`[${requestId}] Enhancing prompt with Gemini API: ${prompt}`);

      const systemPrompt = `You are an expert prompt engineer for image generation models. 
      Your task is to enhance the following real estate property description into a detailed, 
      visually rich prompt that will produce a high-quality image when fed to an image generation model.
      
      Focus on visual details, lighting, perspective, and composition.
      Include specific architectural elements, materials, and surroundings.
      
      Style preference: ${style}
      Era preference: ${era}
      Mood preference: ${mood}
      
      Do not include any explanations or notes. Only output the enhanced prompt text.`;

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }
      );

      // Extract the enhanced prompt from the response
      const enhancedPrompt = response.data.candidates[0].content.parts[0].text;
      console.log(`[${requestId}] Prompt enhanced successfully`);
      
      return enhancedPrompt;
    } catch (error) {
      console.error('Error enhancing prompt with Gemini API:', error);
      // Return original prompt if enhancement fails
      return prompt;
    }
  }
}

export default GeminiService.getInstance();
