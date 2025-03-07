import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import logo from "../assets/LogoHeader.png";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import { onValue, ref } from "firebase/database";
import { db } from "../configs/firebase";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const Header = () => {
  const [user, setUser] = useState(null);
  const [userContext, dispatch]=  useContext(UserContext)
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notify, setNotify] = useState(["Không có thông báo"])
  const [UnseenNotifications, setUnseenNotifications] = useState()

  // ✅ Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    try {
      const response = await axios.post("http://localhost:3000/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("User from Backend:", response.data);
      setUser(response.data);
      dispatch({
        type: "login",
        payload: response.data
    });
    console.log(userContext)
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
    } catch (error) {
      console.error("Lỗi xác thực Google:", error.response?.data || error.message);
    }
  };

  // ✅ Dùng Google One Tap Login
  useGoogleOneTapLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      console.log("Google One Tap Failed");
    },
  });

  useEffect(() => {
    if (user !== null && user.doctor) {
      const appointmentRef = ref(db, `appointments/${user.doctor.id}`);
  
      // Lắng nghe dữ liệu từ Firebase
    const unsubscribe = onValue(appointmentRef, (snapshot) => {
      if (snapshot.exists()) {
        let notifications = Object.values(snapshot.val());

        // Sắp xếp thông báo theo createDate giảm dần (mới nhất lên đầu)
        notifications.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        setNotify(notifications);

        // 🔥 Đếm số lượng thông báo chưa đọc (status === "notseen")
        const unseenCount = notifications.filter(n => n.status === "notseen").length;
        setUnseenNotifications(unseenCount);
        
      }
      
    });
  
      // Cleanup listener khi component unmount
      return () => unsubscribe();
    }
  }, [user]);
  
 

  // ✅ Xử lý logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    dispatch({
      type: "logout"
  });
  
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <img src={logo} alt="KhamBenhNe" style={{ height: "80px" }}  />

        {!user ? (
          <>
            <Button color="inherit" onClick={() => setOpenDialog(true)}>
              <LoginIcon sx={{ mr: 1 }} /> Login
            </Button>

            {/* Modal Login */}
            <Dialog style={{ padding: "100px 10px" }} open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>Login</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="dense"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="dense"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Button fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 1, mx: 'auto', display: 'block'}} onClick={() => alert("Login logic chưa có!")}>
                  Login
                </Button>

                {/* Google Login Button */}
                <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Google Login Failed")} />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
<Box sx={{display: 'flex', alignItems:'center'}}>
{user.doctor && (
                  <IconButton sx={{ marginRight: '20px', cursor: 'pointer' }} onClick={(e) => setNotificationAnchorEl(e.currentTarget)}>
                    <NotificationsIcon  /> <Typography sx={{display: 'inline-block',
            position: 'absolute',color: 'white', fontWeight: 'bold',
            top: '-3px',
            right: '-3px',
            p: '1px 5px', }} >{UnseenNotifications}</Typography>
                  </IconButton>
                )}

                {/* Notifications Menu */}
<Menu
  anchorEl={notificationAnchorEl}
  open={Boolean(notificationAnchorEl)}
  onClose={() => setNotificationAnchorEl(null)}
  PaperProps={{
    sx: {
      maxHeight: 300, // Đặt chiều cao tối đa để xuất hiện scroll
      overflowY: 'auto', // Cho phép cuộn theo chiều dọc
    },
  }}
>
  {notify.length > 0 ? (
    notify.map((notif, index) => (
      <Tooltip title={notif.title}>
      <MenuItem key={index} sx={{ p: 2 }} >
        {notif.status === 'notseen'&& <Typography
          variant="span"
          sx={{
            display: 'inline-block',
            position: 'absolute',
            top: '-7px',
            left: '0px',
            p: '2px',
          }}
          color="primary"
        >
          new
        </Typography>}
        {notif.messeger}
      </MenuItem>
      </Tooltip>
    ))
  ) : (
    <MenuItem>Không có thông báo</MenuItem>
  )}
</Menu>

            {/* Avatar + Menu */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src={user.doctor ? `/avatar_doctor/${user.doctor.id}.png` : `/avatar_patient/${user.patient.id}.png`}
 alt={user.firstName} />
            </IconButton>
            </Box>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem>{user.firstName} {user.lastName}</MenuItem>
              <MenuItem><Link to='/profile'>Profile</Link></MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                Logout
              </MenuItem>
            </Menu>
            
          </>

        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
