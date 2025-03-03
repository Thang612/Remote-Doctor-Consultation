import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardContent, Typography, Avatar, Container, Box, Grid, Paper } from "@mui/material";
import BookingSchedule from "../../components/Doctor/BookingSchedule";
import axios from "axios";

const DoctorDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/doctor/'+ id).then((res)=> {
        setDoctor(res.data)
    }).catch((error) => {
        console.error("Lỗi khi lấy thông tin bác sĩsĩ:", error);
      });
  }, [id]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
    <Paper elevation={3} sx={{ p: 1, borderRadius: 3 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Avatar & Thông tin chính */}
        <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
          <Avatar
  src={`/avatar_doctor/${doctor.id}.png`}
  alt={doctor.user?.firstName}
            sx={{ width: 150, height: 150, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            {doctor.user?.firstName} {doctor.user?.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {doctor.specialty?.name}
          </Typography>
        </Grid>

        {/* Thông tin chi tiết */}
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Typography gutterBottom>
              🩺 Kinh nghiệm: {doctor.experience} năm
            </Typography>
            <Typography gutterBottom>
              📜 Bằng cấp: {doctor.degree?.name}
            </Typography>
            <Typography gutterBottom>
              🏥 Chuyên khoa: {doctor.specialty?.name}
            </Typography>
            <Typography   >
              💰 Chi phí khám: ${doctor.fee.toFixed(2)}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Paper>

    {/* Lịch đặt khám */}
    <Box mt={5}>
      <BookingSchedule doctorId={id} />
    </Box>
  </Container>
  );
};

export default DoctorDetail;
