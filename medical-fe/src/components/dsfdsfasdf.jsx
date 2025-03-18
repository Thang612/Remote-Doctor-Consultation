const utterance = new SpeechSynthesisUtterance("Xin chào, tôi là trợ lý ảo!");
utterance.lang = 'vi-VN';
speechSynthesis.speak(utterance); // Đọc văn bản thành giọng nói