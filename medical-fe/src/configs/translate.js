import axios from 'axios';

export const translateMessage = async (text, targetLanguage) => {
  try {
    const response = await axios.post('http://localhost:3000/translate', {
      text,
      targetLanguage
    });

    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed";
  }
};
