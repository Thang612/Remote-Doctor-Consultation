import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import languages from '../../configs/languages'; // Import ngôn ngữ từ file riêng
import { Rnd } from 'react-rnd';


const LiveCaptionTranslate = () => {
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en'); // Ngôn ngữ mặc định

  const recognitionRef = useRef(null);
  const isRecognitionActive = useRef(false); // Theo dõi trạng thái hoạt động
  const debounceTimer = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'vi'; // Ngôn ngữ mặc định

      recognitionRef.current.onresult = (event) => {
        let tempTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          tempTranscript += event.results[i][0].transcript;
        }

        setTranscript(tempTranscript);

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          translateText(tempTranscript, targetLanguage);
        }, 500);
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        isRecognitionActive.current = true;
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended.');
        isRecognitionActive.current = false;

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
  }, [targetLanguage]); // UseEffect now listens for targetLanguage changes

  const translateText = async (text, targetLanguage) => {
    if (!text) return;

    try {
      const response = await axios.post('http://localhost:3000/translate', {
        text,
        targetLanguage, // Ngôn ngữ đã chọn từ select box
      });
      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

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
      }, 1000);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecognitionActive.current) {
      try {
        recognitionRef.current.start();
        isRecognitionActive.current = true;
        setIsRecording(true);
        console.log(targetLanguage);
        console.log('Speech recognition started');
      } catch (error) {
        console.warn('Start failed:', error);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      isRecognitionActive.current = false;
      setIsRecording(false);
      console.log('Speech recognition stopped');
    }
  };

  const handleLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
    console.log(event.target.value); // Check updated language
  };

  const [RND, SetRND] = useState({ width: 1200, height: 100, x: -20, y: -20 });

  const changePosition = (e, d) => {
    SetRND({ x: d.x, y: d.y });
  };

  const changeSize = (e, direction, ref, delta, position) => {
    SetRND({
      width: ref.style.width,
      height: ref.style.height,
      ...position
    });
  };

  return (
    <>
 {transcript && (
      <Rnd
      size={{ width: RND.width, height: RND.height }}
      position={{ x: RND.x, y: RND.y }}
      onDragStop={changePosition}
      onResizeStop={changeSize}
    >
      {/* Transcript */}
      
        <Paper
          style={{
            marginTop: '-10px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            color: 'white',
            fontSize: '20px',
            borderRadius: '5px',
          }}
        >
          <Typography variant="h6">Transcript:</Typography>
          <Typography variant="body1">{transcript}</Typography>
        </Paper>
      

      {/* Translated Text */}
      {translatedText && (
        <Paper
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            color: 'white',
            fontSize: '20px',
            borderRadius: '5px',
          }}
        >
          <Typography variant="h6">Translated Text:</Typography>
          <Typography variant="body1">{translatedText}</Typography>
        </Paper>
      )}
      </Rnd>
      )}

      <Button
        variant="contained"
        color={isRecording ? 'secondary' : 'primary'}
        onClick={isRecording ? stopRecording : startRecording}
        sx={{ marginLeft: '8px' }}
      >
        {isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
      </Button>

      {/* Select for target language */}
      <FormControl style={{ }}>
        <InputLabel>Chọn ngôn ngữ</InputLabel>
        <Select
          value={targetLanguage}
          onChange={handleLanguageChange}
          label="Chọn ngôn ngữ"
          style={{ width: '200px', marginLeft: '8px' }}
        >
          {Object.keys(languages).map((langCode) => (
            <MenuItem key={langCode} value={languages[langCode]}>
              {languages[langCode]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default LiveCaptionTranslate;
