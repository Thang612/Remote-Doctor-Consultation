import React, { useState } from "react";
import { Grid, Button, TextField, Typography } from "@mui/material";
import dayjs from "dayjs"; // Thư viện xử lý ngày tháng

const BookingSchedule = ({ doctorId }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD")); // Ngày mặc định là hôm nay
  const [selectedTime, setSelectedTime] = useState("");

  // ✅ Giờ hành chính cố định (không thể nhập giờ tùy ý)
  const workingHours = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"];

  // ✅ Xử lý khi chọn ngày
  const handleSelectDate = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(""); // Reset giờ khi đổi ngày
  };

  // ✅ Xử lý chọn giờ từ danh sách
  const handleSelectTime = (time) => {
    setSelectedTime(time);
    handleBooking()
  };

  // ✅ Xác nhận đặt lịch
  const handleBooking = () => {
    if (!selectedTime) {
      alert("Vui lòng chọn khung giờ trước khi đặt lịch!");
      return;
    }
    alert(`Bạn đã đặt lịch hẹn vào ngày ${dayjs(selectedDate).format("DD/MM/YYYY")} lúc ${selectedTime}`);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography gutterBottom fontWeight={'bold'}>
    Ngày Hẹn
      </Typography>

      {/* Input datetime-local chỉ cho phép chọn ngày, không chọn giờ */}
      <TextField
        type="date"
        value={selectedDate}
        onChange={handleSelectDate}
        sx={{ mb: 2 }}
      />

      {/* Hiển thị danh sách giờ hành chính cố định */}
      <Typography gutterBottom fontWeight={'bold'}>
        Giờ Hẹn:
      </Typography>
      <Grid container spacing={2} justifyContent="left" marginBottom={5}>
        {workingHours.map((hour, index) => (
          <Grid item key={index}>
            <Button
              variant={selectedTime === hour ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleSelectTime(hour)}
            >
              {hour}
            </Button>
          </Grid>
        ))}
      </Grid>

    
    </div>
  );
};

export default BookingSchedule;
