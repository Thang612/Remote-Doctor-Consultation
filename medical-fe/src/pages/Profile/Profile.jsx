import React, { useContext, useEffect, useState } from "react";
import { 
  Avatar, Grid, Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, 
  Button 
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Appointments = () => {
  const [user] = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const role = user.doctor ? "doctor" : "patient";
        const userId = user.doctor ? user.doctor.id : user.patient.id;
        const url = selectedDate
          ? `http://localhost:3000/appointments/${role}/${userId}/by-date?startTime=${selectedDate}`
          : `http://localhost:3000/appointments/${role}/${userId}`;

        const response = await axios.get(url);
        setAppointments(response.data);
      } catch (error) {
        console.error("Lỗi lấy lịch hẹn:", error);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [user, selectedDate]);

  

  if (!user) {
    return <Typography variant="h6" textAlign="center">Bạn chưa đăng nhập!</Typography>;
  }

  // Xác định là Doctor hay Patient
  const isDoctor = !!user?.doctor;
  const profileData = isDoctor ? user.doctor : user.patient;
  const avatarSrc = isDoctor 
    ? `/avatar_doctor/${profileData?.id}.png` 
    : `/avatar_patient/${profileData?.id}.png`;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {/* Cột bên trái - Avatar và thông tin cá nhân */}
        <Grid item xs={4} textAlign="center">
          <Avatar
            src={avatarSrc}
            alt={user.firstName || "User"}
            sx={{ width: 150, height: 150, mb: 2, m: "auto" }}
          />
          <Typography variant="h5" fontWeight="bold">
            {user.firstName} {user.lastName || ""}
          </Typography>
          {isDoctor ? (
            <>
              <Typography>🩺 Kinh nghiệm: {profileData.experience || 0} năm</Typography>
              <Typography>📜 Bằng cấp: {profileData.degree?.name || "Không có"}</Typography>
              <Typography>🏥 Chuyên khoa: {profileData.specialty?.name || "Không có"}</Typography>
              <Typography>💰 Phí khám: ${profileData.fee || "0"}</Typography>
            </>
          ) : (
            <>
              <Typography>🩸 Nhóm máu: {profileData.blood || "Không rõ"}</Typography>
            </>
          )}
        </Grid>

        {/* Cột bên phải - Danh sách lịch hẹn */}
        <Grid item xs={8}>
          <Typography variant="h6" fontWeight="bold" textAlign="left" mt={3} mb={2}>
            {isDoctor ? "📅 Lịch Hẹn Của Bác Sĩ" : "📅 Lịch Hẹn Của Bạn"}
          </Typography>
          
          {/* Bộ lọc ngày */}
          <TextField
            label="Chọn ngày"
            type="date"
            sx={{ mb: 2 }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
          ) : appointments.length === 0 ? (
            <Typography textAlign="center">Không có lịch hẹn nào!</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>#</strong></TableCell>
                    <TableCell><strong>Ngày</strong></TableCell>
                    <TableCell><strong>Bác sĩ / Bệnh nhân</strong></TableCell>
                    <TableCell><strong>Trạng thái</strong></TableCell>
                    <TableCell><strong>Chi tiết</strong></TableCell>
                    <TableCell><strong>Hành động</strong></TableCell> {/* ✅ Cột mới */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appt, index) => (
                    <TableRow key={appt.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{appt.startTime}</TableCell>

                      {/* Hiển thị bác sĩ hoặc bệnh nhân */}
                      <TableCell>
                        {isDoctor ? (
                          <>
                            <Avatar src={`/avatar_patient/${appt.patient.id}.png`} sx={{ width: 30, height: 30, mr: 1 }} />
                            {appt.patient.firstName} {appt.patient.lastName}
                          </>
                        ) : (
                          <>
                            <Avatar src={`/avatar_doctor/${appt.doctor.id}.png`} sx={{ width: 30, height: 30, mr: 1 }} />
                            Dr. {appt.doctor.firstName} {appt.doctor.lastName}
                          </>
                        )}
                      </TableCell>

                      {/* Trạng thái thanh toán */}
                      <TableCell>
                        {appt.payment ? (
                          <Typography color="green">✅ Đã Thanh Toán</Typography>
                        ) : (
                          <Typography color="red">❌ Chưa Thanh Toán</Typography>
                        )}
                      </TableCell>

                      {/* Ghi chú */}
                      <TableCell>{appt.note || "Không có ghi chú"}</TableCell>

                      {/* ✅ Nút Chi Tiết */}
                      <TableCell>
                        <Button
                          component={Link}
                          to={`/videocall/${appt.idMeeting}`}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Khám bệnh
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Appointments;