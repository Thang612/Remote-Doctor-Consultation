import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, TextField, IconButton, List, ListItem, Typography, Select, MenuItem, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { onValue, push, ref } from 'firebase/database';
import { db } from '../../configs/firebase';
import { UserContext } from '../../App';
import { translateMessage } from '../../configs/translate';
import languages from '../../configs/languages'; // Import ngôn ngữ từ file riêng

const ChatBox = ({ idMeeting }) => {
  const [user] = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [isRecording, setIsRecording] = useState(false);  // Trạng thái ghi âm
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  // Hàm nhận dạng giọng nói
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'vi';  // Ngôn ngữ nhận diện giọng nói mặc định là tiếng Việt

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);  // Cập nhật văn bản trong ô nhập tin nhắn
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsRecording(true);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
      
        if (input.trim()) {
          handleSendMessage(); // Gửi tin nhắn sau khi ghi âm hoàn tất
        }
      };
      

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.warn('Web Speech API không hỗ trợ trên trình duyệt này.');
    }
  }, []);

  // Đọc tin nhắn
  useEffect(() => {
    if (!idMeeting) return;

    const messagesRef = ref(db, `chats/${idMeeting}`);
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const loadedMessages = Object.values(data);
        setMessages(loadedMessages);
      }
    });

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [idMeeting]);

  const handleTranslate = async (text, index) => {
    try {
      const translatedText = await translateMessage(text, language);
      setTranslatedMessages((prev) => ({
        ...prev,
        [index]: translatedText,
      }));
    } catch (error) {
      console.error("Translation error:", error);
      alert("Translation failed. Please try again.");
    }
  };

  // Gửi tin nhắn lên Firebase
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        sender: `${user?.firstName} ${user?.lastName}`,
        avatar: user?.doctor
          ? `/avatar_doctor/${user?.doctor?.id}.png`
          : user?.patient
          ? `/avatar_patient/${user?.patient?.id}.png`
          : '/default_avatar.png',
        timestamp: new Date().toLocaleTimeString(),
      };

      const messagesRef = ref(db, `chats/${idMeeting}`);
      await push(messagesRef, newMessage);
      setInput('');
    }
  };

  // Bắt đầu ghi âm khi giữ nút mic
  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // Không gọi handleSendMessage ở đây
    }
  };
  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          padding: '16px',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Chatbox

        {/* Chọn ngôn ngữ */}
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{
            marginLeft: '16px',
            color: '#fff',
            '& .MuiSelect-icon': { color: '#fff' },
          }}
        >
          {Object.entries(languages).map(([code, name]) => (
            <MenuItem key={code} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Nội dung tin nhắn */}
      <Box
        ref={chatRef}
        sx={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === `${user?.firstName} ${user?.lastName}` ? 'flex-end' : 'flex-start' }}>
              <Box
                sx={{
                  display: 'flex',
                  padding: '8px',
                  backgroundColor: msg.sender === `${user?.firstName} ${user?.lastName}` ? 'primary.main' : '#e9e9e9',
                  color: msg.sender === `${user?.firstName} ${user?.lastName}` ? '#fff' : '#000',
                  borderRadius: '12px',
                  maxWidth: '70%',
                }}
              >
                <img
                  src={msg.avatar}
                  alt="avatar"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
                />
                <Box>
                  <Typography>{msg.sender}</Typography>
                  <Typography>{msg.text}</Typography>

                  {/* Bản dịch */}
                  {translatedMessages[index] && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'gray', fontStyle: 'italic', marginTop: '4px' }}
                    >
                      {translatedMessages[index]}
                    </Typography>
                  )}
                  <Typography variant="caption">{msg.timestamp}</Typography>
                </Box>

                {/* Nút dịch */}
                <Tooltip title="Translate">
                  <IconButton
                    size="small"
                    onClick={() => handleTranslate(msg.text, index)}
                    sx={{ marginLeft: '8px' }}
                  >
                    <GTranslateIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Thanh nhập tin nhắn */}
      <Box sx={{ padding: '8px', display: 'flex' }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          fullWidth
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        
        {/* Nút mic */}
        <Tooltip title={isRecording ? "Stop recording" : "Hold to record"}>
          <IconButton
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
          >
            <MicIcon color={isRecording ? 'secondary' : 'primary'} />
          </IconButton>
        </Tooltip>
        
        {/* Nút gửi */}
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBox;