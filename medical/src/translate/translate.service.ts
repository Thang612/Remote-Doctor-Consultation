import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyC2eF9k8wCfDCbm3FZiJdZzdaBqwYnUnaI'; // 🔥 Thay bằng API Key của bạn

@Injectable()
export class TranslateService {
  private genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      if (!text || !targetLanguage) {
        throw new Error('Missing text or target language');
      }

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `You are a professional medical translator. Your task is to translate the following conversation from a doctor-patient consultation into ${targetLanguage}. 

Please follow these rules:
1. **Preserve all medical terminology** (diseases, medications, symptoms, treatments, and medical procedures) exactly as they are.
2. **Do not add explanations or additional context.** Only return the translated text.
3. **Keep the conversation natural** as if it was spoken by a real doctor or patient.
4. **Use clear and professional language** suitable for a medical setting.

Original text: ${text}
Translation:`;

      const result = await model.generateContent(prompt);
      const translatedText = result.response.text();

      console.log('Translated:', translatedText); // Log để debug
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw new InternalServerErrorException('Translation failed');
    }
  }
}
