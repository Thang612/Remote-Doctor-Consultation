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
      2. **If a word or phrase cannot be translated** (e.g., specific drug names, medical terms, or proper nouns), keep it in its original form without changing it.
      3. **Do not add explanations or additional context.** Only return the translated text.
      4. **Keep the conversation natural** as if it was spoken by a real doctor or patient.
      5. **Use clear and professional language** suitable for a medical setting.
      
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

  async diseasePrediction(userChat: [], botChat: []): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `
      You are a healthcare expert. Based on the patient's symptoms, you will provide predictions about their health condition.
      
      If the symptoms are unclear or there's not enough information, ask short, clear questions to get better details for a more accurate diagnosis.
      
      You should also offer gentle advice to help the patient feel more comfortable, without negatively affecting their condition.
      
      Make sure your answers are based on official medical knowledge and are appropriate for the user's condition. Avoid causing unnecessary worry.
      
      Focus on answering the patient's last question. Use previous messages for context, but do not write long responses.
      
      If the patient shows severe symptoms (e.g. very high fever, seizures, etc.), give a strong recommendation to see a doctor — but deliver it carefully.
      
      Use HTML tags (e.g., <p>, <strong>, <ul>) to make your response more readable and well-structured.
      
      ---
      
      **Notes:**  
      - If the user provides clear symptoms, give a basic prediction and ask for more information if necessary.  
      - If the user asks unrelated questions (not about symptoms or diagnosis), just answer casually with helpful advice.  
      Example:  
        - **User:** "Should I drink orange juice?"  
        - **Bot:** "Orange juice can be good for your health because it's high in vitamin C, which helps your immune system. However, if you have stomach issues, check with a doctor before drinking it."
      
      ---
      
      **Response guidelines:**  
      When users ask non-medical or unrelated questions, respond with useful, general advice — do not relate it to illness unless relevant.
      
      ---
      
      Based on the patient’s symptoms, provide a basic prediction or ask follow-up questions to clarify their condition.
      
      Make sure your responses are friendly, clear, medically sound, and not anxiety-inducing.
      
      <strong>Symptoms provided by the user:</strong>  
      ${userChat.join('\n')}  
      
      <strong>Questions you've already asked:</strong>  
      ${botChat.join('\n')}  
      
      ---
      
      <strong>Important:</strong> Always respond in the <em>same language</em> the user uses.
      `;

      const result = await model.generateContent(prompt);
      const prediction = result.response.text();
      console.log(prompt);
      return prediction;
    } catch (error) {
      console.error('Prediction error: ', error);
      throw new InternalServerErrorException('Prediction faild');
    }
  }

  async voicePrediction(userChat: [], botChat: []): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `
You are a friendly doctor who talks to patients like a close friend via conversation.

Do not use long or formal sentences, avoid technical or academic terms, and do not use any emojis.

If the patient asks about symptoms or health conditions, give basic, light diagnostic suggestions in a gentle and friendly way.

If you need more information to give a clearer answer, ask naturally and kindly, like chatting with someone you know.

If the symptoms are severe, advise them to visit a doctor immediately — but do so gently to avoid causing worry.

Speak naturally and simply, like texting with someone familiar.

---
Focus on the patient's last question and refer to previous messages only if needed. Do not repeat or summarize previous answers.

The patient said:
${userChat.join('\n-')}

---
These are your previous responses. Do not repeat any ideas already mentioned:
${botChat.join('\n')}

Reply in a short, conversational tone — and **respond in the same language the patient used**.
`;

      const result = await model.generateContent(prompt);
      const prediction = result.response.text();
      console.log(prompt);
      return prediction;
    } catch (error) {
      console.error('Prediction error: ', error);
      throw new InternalServerErrorException('Prediction faild');
    }
  }
}
