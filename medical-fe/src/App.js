import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './layout/Header';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DoctorDetail from './pages/Detail/Doctor';
import { createContext, useEffect, useReducer } from 'react';
import Profile from './pages/Profile/Profile';
import UserReducer from './reducers/UserReducer';
import { VideoRoom } from './VideoCall/VideoRoom';

export const UserContext = createContext()

const App =() => {
  const [user, dispatch] = useReducer(UserReducer)
  useEffect(()=>{
    localStorage.removeItem("user");
  }, [])

  return (
    <>
    <UserContext.Provider value={[user , dispatch]}>
    <GoogleOAuthProvider clientId="558699822073-bo52ighlvksekp2lj1q2b4f8stvi9a4r.apps.googleusercontent.com"> 
    <ThemeProvider theme={theme}>
    
    <BrowserRouter>
    <Header></Header>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/doctor/:id' element={<DoctorDetail/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/videocall/:idMeeting' element={<VideoRoom/>}></Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </GoogleOAuthProvider>
    </UserContext.Provider>
    </>
  );
}

export default App;
