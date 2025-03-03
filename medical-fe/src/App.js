import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './layout/Header';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DoctorDetail from './pages/Profile/Doctor';
import { useEffect } from 'react';

const App =() => {

  useEffect(()=>{
    localStorage.removeItem("user");
  }, [])

  return (
    <>
    <GoogleOAuthProvider clientId="558699822073-bo52ighlvksekp2lj1q2b4f8stvi9a4r.apps.googleusercontent.com"> 
    <ThemeProvider theme={theme}>
    <Header></Header>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/doctor/:id' element={<DoctorDetail/>}></Route>
        <Route></Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </GoogleOAuthProvider>
    </>
  );
}

export default App;
