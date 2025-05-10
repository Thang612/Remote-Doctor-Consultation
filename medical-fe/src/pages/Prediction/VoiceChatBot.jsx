import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IconButton, Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const VoiceChatBot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [userChat, setUserChat] = useState([]);
  const [botChat, setBotChat] = useState([]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nói chuyện bằng giọng nói.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript;
        console.log("Bạn vừa nói:", userSpeech);
        setUserChat((prevUserChat) => [...prevUserChat, userSpeech]);
      };
      

      

    recognition.onerror = (event) => {
      console.error("Lỗi nhận diện:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (userChat.length > 0) {
      sendToBot(userChat, botChat);
    }
  }, [userChat]);

  const sendToBot = async (newUserChat, currentBotChat) => {
    console.log("Gửi đến bot:", newUserChat, currentBotChat);
    try {
      const res = await axios.post("http://localhost:3000/translate/voiceprediction", {
        userChat: newUserChat,
        botChat: currentBotChat,
      });
  
      const botResponse = res.data;
      console.log("Bot trả lời:", botResponse);
  
      setBotChat((prev) => [...prev, botResponse]);
  
      const utter = new SpeechSynthesisUtterance(botResponse);
      utter.lang = "vi-VN";
      speechSynthesis.speak(utter);
    } catch (err) {
      console.error("Lỗi gửi yêu cầu:", err);
    } finally {
      setIsRecording(false);
    }
  };
  
  

  useEffect(() => {
    console.log("👉 userChat mới:", userChat);
  }, [userChat]);

  useEffect(() => {
    console.log("🤖 botChat mới:", botChat);
  }, [botChat]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <IconButton
        onClick={startListening}
        sx={{
          backgroundColor: isRecording ? "red" : "primary.main",
          color: "white",
          width: 100,
          height: 100,
          borderRadius: "50%",
          boxShadow: 3,
          transition: "0.3s",
          "&:hover": { opacity: 0.8 }
        }}
      >
        <SmartToyIcon sx={{ fontSize: 60 }} />
      </IconButton>
      <Typography sx={{ marginTop: 2, fontSize: 18 }}>
        {isRecording ? "Đang nghe..." : "Nhấn để nói chuyện với AI"}
      </Typography>
    </Box>
  );
};

export default VoiceChatBot;
