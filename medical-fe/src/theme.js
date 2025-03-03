import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#61BACA", // Màu chính (Primary)
      light: "#ff8a50", // Màu nhạt hơn
      dark: "#c41c00",  // Màu đậm hơn
      contrastText: "#fff", // Màu chữ trên nền primary
    },
    secondary: {
      main: "#4caf50", // Màu phụ (Secondary)
    },
  },
});

export default theme;
