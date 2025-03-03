import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CardActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorGrid = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();


  useEffect(() => {
    axios
      .get("http://localhost:3000/doctor")
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách bác sĩ...</p>;

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {doctors.map((doctor) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
          <Card sx={{ maxWidth: 345, textAlign: "center", padding: 2, boxShadow: 3 }}>
            <Avatar
  src={`/avatar_doctor/${doctor.id}.png`}
  alt={doctor.user.firstName}
              sx={{ width: 150, height: 150, margin: "auto" }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {doctor.user.firstName} {doctor.user.lastName}
              </Typography>
              <Typography color="textSecondary">🩺 Kinh nghiệm: {doctor.experience} năm</Typography>
              <Typography color="textSecondary">📜 Bằng cấp: {doctor.degree.name}</Typography>
              <Typography color="textSecondary">🏥 Chuyên khoa: {doctor.specialty.name}</Typography>
              <Typography variant="h6" color="primary">
                💰 ${doctor.fee.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" fullWidth onClick={()=> {nav(`/doctor/${doctor.id}`)}}>
                Xem Chi Tiết
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DoctorGrid;
