import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, IconButton, List, ListItem, Typography, Container } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInterface = () => {
  const [input, setInput] = useState("");  // Giá trị tin nhắn đầu vào
  const [messages, setMessages] = useState([]);  // Lưu trữ tất cả tin nhắn (user + bot)

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (input.trim()) {
      // Thêm tin nhắn của người dùng vào danh sách tin nhắn
      const newMessage = {
        sender: "User",
        text: input,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");  // Reset input sau khi gửi

      // Gọi API dự đoán hoặc API dịch
      try {
        // Chỉ lấy các tin nhắn của người dùng và bot trước đó (không gửi lại tin nhắn hiện tại)
        const userMessages = messages.filter(msg => msg.sender === 'User').map(msg => msg.text);
        const botMessages = messages.filter(msg => msg.sender === 'Bot').map(msg => msg.text);

        const response = await axios.post("http://localhost:3000/translate/prediction", {
          userChat: [...userMessages, input],  // Gửi tin nhắn người dùng mới
          botChat: botMessages,  // Gửi tin nhắn bot trước đó
        });

        const prediction = response.data; // Lấy kết quả dự đoán từ API
        console.log(prediction)
        // Thêm tin nhắn của bot vào danh sách
        const botMessage = {
          sender: "Bot",
          text: prediction, // Hoặc bạn có thể thêm logic để xử lý dự đoán
          timestamp: new Date().toLocaleString(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending messages:", error);
      }
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%', border: '1px solid #ccc', borderRadius: '8px' }}>
      <Box sx={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === "User" ? "flex-end" : "flex-start" }}>
              <Box sx={{ display: "flex", padding: "8px", paddingRight: '12px', backgroundColor: msg.sender === "User" ? "primary.main" : "#e9e9e9", color: msg.sender === "User" ? "#fff" : "#000", borderRadius: "12px", maxWidth: "70%" }}>
                <Typography sx={{fontWeight: 'bold', marginRight: '10px', marginLeft: '5px', fontSize: '16px'}}>{msg.sender}: </Typography>
                <Box
                  sx={{
                    color: msg.sender === "User" ? '#fff' : '#000',
                    fontStyle: 'italic',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}  // Render HTML của text
                />
              </Box>
              <Typography variant="caption" sx={{margin: '5px'}}>  {msg.timestamp}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ padding: '8px', display: 'flex', position: 'sticky', bottom: '0', width:'100%', }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          fullWidth
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container >
  );
};

export default ChatInterface;
