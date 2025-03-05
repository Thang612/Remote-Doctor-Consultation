import React, { useState } from "react";
import { Grid, Button, TextField, Typography, Modal, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import dayjs from "dayjs";
import axios from "axios";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ref, set } from "firebase/database";
import { db } from "../../configs/firebase";

const BookingSchedule = ({ doctor }) => {
  const doctorId = doctor.id;
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const workingHours = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"];

  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Handle date selection
  const handleSelectDate = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime("");
  };

  // Handle time selection
  const handleSelectTime = (time) => {
    if (!localStorage.getItem("user")) {
      alert('Bạn cần đăng nhập trước khi đặt lịch!!!');
      return;
    }
    if (JSON.parse(localStorage.getItem("user")).doctor) {
      alert('Bạn đang đăng nhập ở tư cách bác sĩ. Bạn cần chuyển sang người dùng để đặt lịch!!!');
      return;
    }
    setSelectedTime(time);
    setOpenNoteModal(true);
  };

  // Handle booking after successful payment
  const handleBooking = (details) => {
    setIsLoading(true);
    const patient = JSON.parse(localStorage.getItem("user"));
    const formattedStartTime = dayjs(`${selectedDate} ${selectedTime}`)
      .tz('Asia/Ho_Chi_Minh', true)
      .format();

    const appointmentRef = ref(db, `appointments/${doctorId}/notify${doctorId}${patient.patient.id}${Math.floor(Math.random() * 112323)}`);
    
    set(appointmentRef, {
      messeger: `Bạn có một cuộc hẹn từ bệnh nhân ${patient.firstName} ${patient.lastName} vào ${selectedTime} - ${selectedDate}`,
      patientId: patient.patient.id,
      doctorId: doctorId,
      status: 'notseen',
      title:note,
      createDate: new Date().toISOString()
    }).then(() => {
      console.log("Lịch hẹn đã được tạo thành công!");
      setIsLoading(false);
    }).catch(error => {
      console.error("Lỗi khi đặt lịch hẹn:", error);
      alert("Có lỗi khi đặt lịch, vui lòng thử lại!");
      setIsLoading(false);
    });

    axios.post('http://localhost:3000/appointments/', {
      date: dayjs().format("YYYY-MM-DD"),
      doctor: doctorId,
      patient: patient.patient.id,
      startTime: formattedStartTime,
      note: note,
      payment: {
        date: dayjs().format("YYYY-MM-DD"), 
        total: doctor.fee, 
        idPayment: details.id
      }
    })
    .then(() => {
      setIsLoading(false);
      alert(`Bạn đã đặt lịch hẹn vào ngày ${dayjs(selectedDate).format("DD/MM/YYYY")} lúc ${selectedTime}`);
      setOpenPaymentModal(false);
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      alert("Đặt lịch không thành công. Vui lòng thử lại.");
    });
  };

  // Handle payment success
  const handlePaymentSuccess = (details) => {
    console.log("Gọi handleBooking sau khi thanh toán thành công...");
    handleBooking(details);
    setOpenPaymentModal(false);
  };

  const handlePaymentClick = () => {
    setNote(document.getElementById('note').value);
    setOpenPaymentModal(true);
    setOpenNoteModal(false);
  };

  // Note modal content
  const NoteModal = () => (
    <Dialog open={openNoteModal} onClose={() => setOpenNoteModal(false)}>
      <DialogTitle color="primary" fontWeight="bold">Nhập lưu ý</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nhập nội dung bạn cần bác sĩ lưu ý trước khi khám.
        </DialogContentText>
        <TextField
          id='note'
          autoFocus
          required
          margin="dense"
          label="Nhập lưu ý của bạn"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePaymentClick}>Thanh toán</Button>
      </DialogActions>
    </Dialog>
  );

  // Payment modal content
  const PaymentModal = () => (
    <Modal open={openPaymentModal} onClose={() => setOpenPaymentModal(false)}>
      <Box sx={styles.modalBox}>
        <Typography variant="h6" gutterBottom>
          Thanh toán
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bạn có chắc chắn muốn thanh toán để xác nhận lịch hẹn của mình?
        </Typography>
        <Typography>Chi phí: {doctor.fee}$</Typography>
        <PayPalScriptProvider options={{ "client-id": "sandbox" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: doctor.fee.toString(),
                  },
                }],
              });
            }}
            onApprove={(data, actions) => {
              console.log("Thanh toán thành công, dữ liệu trả về:", data);
              return actions.order.capture()
                .then(function (details) {
                  console.log("Chi tiết đơn hàng:", details);
                  alert("Thanh toán thành công!");
                  handlePaymentSuccess(details);
                  setOpenPaymentModal(false); // Đóng modal ngay sau khi thanh toán
                  return Promise.resolve(); // Báo cho PayPal biết giao dịch đã hoàn tất
                })
                .catch(err => {
                  console.error("Lỗi khi xác nhận thanh toán:", err);
                  alert("Có lỗi xảy ra khi xác nhận thanh toán!");
                });
            }}
          />
        </PayPalScriptProvider>
      </Box>
    </Modal>
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography gutterBottom fontWeight={'bold'}>Ngày Hẹn</Typography>
      <TextField type="date" value={selectedDate} onChange={handleSelectDate} sx={{ mb: 2 }} />
      <Typography gutterBottom fontWeight={'bold'}>Giờ Hẹn:</Typography>
      <Grid container spacing={2}>
        {workingHours.map((hour, index) => (
          <Grid item key={index}>
            <Button variant={selectedTime === hour ? "contained" : "outlined"} color="primary" onClick={() => handleSelectTime(hour)}>
              {hour}
            </Button>
          </Grid>
        ))}
      </Grid>
      {isLoading && <CircularProgress />}
      {openNoteModal && <NoteModal />}
      {openPaymentModal && <PaymentModal />}
    </div>
  );
};

const styles = {
  modalBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: 24,
    width: 300,
    textAlign: 'center',
  },
};

export default BookingSchedule;
