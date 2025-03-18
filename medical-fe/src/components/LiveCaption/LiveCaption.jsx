import React, { useState, useEffect, useRef } from 'react';
import { franc } from 'franc-min';
import axios from 'axios';

const LiveCaptionTranslate = () => {
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef(null);
  const isRecognitionActive = useRef(false); // Theo dõi trạng thái hoạt động

  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'vi'; // Ngôn ngữ mặc định

      // Khi có kết quả nhận diện
      recognitionRef.current.onresult = (event) => {
        let tempTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          tempTranscript += event.results[i][0].transcript;
        }

        setTranscript(tempTranscript);

        // Delay 1 giây trước khi dịch
  setTimeout(() => {
    translateText(tempTranscript);
  }, 1000);
      };

      // Khi nhận diện bắt đầu
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        isRecognitionActive.current = true;
      };

      // Khi nhận diện kết thúc, tự động restart nếu vẫn đang ghi âm
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended.');
        isRecognitionActive.current = false;
      
        // Kiểm tra nếu đang ghi âm thì restart lại
        if (isRecording && !isRecognitionActive.current) {
          restartRecognition();
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech' && isRecording) {
          restartRecognition();
        }
      };
    } else {
      console.warn('Web Speech API không hỗ trợ trên trình duyệt này.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Hàm dịch văn bản
  const translateText = async (text) => {
    if (!text) return;
    const detectedLang = franc(text);
    const targetLanguage = detectedLang === 'eng' ? 'vi' : 'en';

    try {
      const response = await axios.post('http://localhost:3000/translate', {
        text,
        targetLanguage,
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  // Hàm khởi động lại nhận diện khi bị dừng
  const restartRecognition = () => {
    if (recognitionRef.current && !isRecognitionActive.current) {
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          console.log('Restarting recognition...');
          isRecognitionActive.current = true;
        } catch (error) {
          console.warn('Restart failed:', error);
        }
      }, 1000); // Đợi 1 giây trước khi restart
    }
  };

  // Bắt đầu nhận diện
  const startRecording = () => {
    if (recognitionRef.current && !isRecognitionActive.current) {
      try {
        recognitionRef.current.start();
        isRecognitionActive.current = true;
        setIsRecording(true);
        console.log('Speech recognition started');
      } catch (error) {
        console.warn('Start failed:', error);
      }
    }
  };

  // Dừng nhận diện
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      isRecognitionActive.current = false;
      setIsRecording(false);
      console.log('Speech recognition stopped');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
      </button>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '20px', borderRadius: '5px', display: transcript ? 'block' : 'none' }}>
        <h3>Transcript:</h3>
        {transcript}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', fontSize: '20px', borderRadius: '5px', display: translatedText ? 'block' : 'none' }}>
        <h3>Translated Text:</h3>
        {translatedText}
      </div>
    </div>
  );
};

export default LiveCaptionTranslate;
