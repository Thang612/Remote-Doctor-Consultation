import React, { useState } from "react";
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
} from "@mui/material";
import logo from "../assets/LogoHeader.png";
import LoginIcon from "@mui/icons-material/Login";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    try {
      const response = await axios.post("http://localhost:3000/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("User from Backend:", response.data);
      setUser(response.data);
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

  // ✅ Xử lý logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <img src={logo} alt="KhamBenhNe" style={{ height: "80px" }} />

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
            {/* Avatar + Menu */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src={user.doctor ? `/avatar_doctor/${user.doctor.id}.png` : `/avatar_patient/${user.patient.id}.png`}
 alt={user.firstName} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem>{user.firstName} {user.lastName}</MenuItem>
              <MenuItem onClick={() => alert("Go to Profile")}>Profile</MenuItem>
              <MenuItem onClick={() => alert("Go to Settings")}>Settings</MenuItem>
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
