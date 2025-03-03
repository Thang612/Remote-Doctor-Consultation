import React, { useState } from "react";
import { Grid, Button, TextField, Typography, Modal, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import dayjs from "dayjs";
import axios from "axios";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const BookingSchedule = ({ doctor }) => {
  const doctorId = doctor.id;
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const workingHours = ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"];

  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Handle date selection
  const handleSelectDate = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime(""); // Reset time when the date changes
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
    setOpenNoteModal(true); // Open note modal when time is selected
  };

  // Handle booking after successful payment
  const handleBooking = () => {
    setIsLoading(true); // Start loading

    const patientId = JSON.parse(localStorage.getItem("user")).patient.id;
    const formattedStartTime = dayjs(`${selectedDate} ${selectedTime}`)
      .tz('Asia/Ho_Chi_Minh', true)
      .format();

    axios.post('http://localhost:3000/appointments/', {
      date: dayjs().format("YYYY-MM-DD"),
      doctor: doctorId,
      patient: patientId,
      startTime: formattedStartTime,
      note: note,
    })
    .then(() => {
      setIsLoading(false); // Stop loading
      alert(`Bạn đã đặt lịch hẹn vào ngày ${dayjs(selectedDate).format("DD/MM/YYYY")} lúc ${selectedTime}`);
      setOpenPaymentModal(false); // Close payment modal after booking
    })
    .catch((error) => {
      setIsLoading(false); // Stop loading in case of error
      console.log(error);
      alert("Đặt lịch không thành công. Vui lòng thử lại.");
    });
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    handleBooking(); // Proceed to booking after payment is successful
  };

  const handlePaymentClick = () => {
    setNote(document.getElementById('note').value)
    setOpenPaymentModal(true); // Open payment modal
    setOpenNoteModal(false); // Close note modal
  };

  // Note modal content
  const NoteModal = () => (
    <Dialog open={openNoteModal} onClose={() => setOpenNoteModal(false)}>
      <DialogTitle color="primary" fontWeight="bold">Nhập lưu ý</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Nhập nội dung bạn cần bác sĩ lưu ý trước khi khám.
          Nội dung sẽ hữu ích giúp bác sĩ có những phán đoán sơ bộ ban đầu.
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
    <Modal
      open={openPaymentModal}
      onClose={() => setOpenPaymentModal(false)}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={styles.modalBox}>
        <Typography variant="h6" gutterBottom>
          Thanh toán
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bạn có chắc chắn muốn thanh toán để xác nhận lịch hẹn của mình?
        </Typography>
        <Typography>Chi phí: {doctor.fee}$</Typography>
        {/* PayPal Button */}
        <PayPalScriptProvider options={{ "client-id": "ATpjUjaxfhH7tz2Ck2Qt51OKYOggjZj70hFVsyScAEyl3LaT-jj07QjV8FLgPjCcmypxcNcdfatuMz3c" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: doctor.fee,
                  },
                }],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(function(details) {
                alert("Thanh toán thành công!");
                handlePaymentSuccess();
              });
            }}
            onError={(err) => {
              console.log("Error: ", err);
            }}
          />
        </PayPalScriptProvider>
      </Box>
    </Modal>
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography gutterBottom fontWeight={'bold'}>
        Ngày Hẹn
      </Typography>
      <TextField
        type="date"
        value={selectedDate}
        onChange={handleSelectDate}
        sx={{ mb: 2 }}
      />
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

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </div>
      )}

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
