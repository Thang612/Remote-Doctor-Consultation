import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import { Box, Button, Dialog } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/VideoCall/ChatBox';
import CloseIcon from '@mui/icons-material/Close';


const APP_ID = '718f01f1af4847bfa65a2cb1bb454b00';

const createAgoraClient = (onVideoTrack, onUserDisconnected) => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  client.on('user-published', async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      onVideoTrack(user);
    }
    if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  });

  client.on('user-left', (user) => {
    onUserDisconnected(user);
  });

  return client;
};

export const VideoRoom = () => {
  const { idMeeting } = useParams();

  // ✅ Lấy user từ localStorage và parse thành object
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });

  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(null);
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [channel, setChannel] = useState(idMeeting || '');
  const [openChatBox, setOpenChatBox] = useState(true)
  const [isMuted, setIsMuted] = useState(false);


  const toggleMute = async () => {
    if (localTracks[0]) {
      setIsMuted(!localTracks[0].enabled);
      await localTracks[0].setEnabled(isMuted);
    }
  };
  useEffect(() => {
    const onVideoTrack = (user) => {
      setUsers((prev) => [...prev, user]);
    };

    const onUserDisconnected = (user) => {
      setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    const agoraClient = createAgoraClient(onVideoTrack, onUserDisconnected);
    setClient(agoraClient);

    // ✅ Cleanup client khi unmount
    return () => {
      if (agoraClient) {
        agoraClient.leave();
      }
    };
  }, [idMeeting]);

  const joinRoom = async () => {
    if (!channel) {
      alert('Please enter a room code!');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/videocall/generate-token`, {
        params: { channel, uid: 0 },
      });

      const { token } = response.data;
      if (!token) throw new Error('Token is undefined');

      const { uid: newUid } = await client.join(APP_ID, channel, token);
      setUid(newUid);

      // ✅ Lấy tracks từ microphone và camera
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      // ✅ Public video và audio lên kênh
      await client.publish([microphoneTrack, cameraTrack]);
      setLocalTracks([microphoneTrack, cameraTrack]);

      // ✅ Thêm chính mình vào danh sách người dùng
      setUsers((prev) => [
        ...prev,
        {
          uid: newUid,
          videoTrack: cameraTrack,
          audioTrack: microphoneTrack,
          username: `${user?.firstName ?? 'Unknown'} ${user?.lastName ?? ''}`.trim(),
          avatar: user?.doctor 
            ? `/avatar_doctor/${user.doctor.id}.png`
            : user?.patient 
              ? `/avatar_patient/${user.patient.id}.png`
              : '/default_avatar.png', // ✅ Đặt avatar mặc định nếu không có
        },
      ]);
    } catch (error) {
      console.error('Failed to join the room:', error);
    }
  };

  const leaveRoom = async () => {
    if (client) {
      await client.leave();

      // ✅ Cleanup tracks (tránh memory leak)
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      setLocalTracks([]);
      setUid(null);
      setUsers([]);
    }
  };

  const handleCloseChatBox = () => {
    console.log('Đã đóng ChatBox');
    setOpenChatBox(false);
  };
  

  return (
    <>
  <Box onClick={() => setOpenChatBox(true)}
  sx={{
    position:'fixed',
    top: '50vh',
    p:'15px 12px 15px 50px',
    borderRadius:'15px',
    lineHeight: 2,
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
    transform:'translateX(-40px)',
    backgroundColor:'primary.main',
    cursor:'pointer'
  }}>
    Nhắn <br/> tin 
  </Box>

    <Dialog open={openChatBox}  fullWidth maxWidth="md"   onClose={() => setOpenChatBox(false)}

    sx={{
      position:  'fixed',
      left: '10px',
      top: '50px',
      width: '550px', 
      height: 'calc(90vh)'
    }}>
      <CloseIcon        onClick={handleCloseChatBox}
      sx={{
        color:'white',
        display:'block',
        position: 'absolute',
        top:'16px', 
        right:'16px',
        fontSize: '30px',
        cursor: 'pointer',
        zIndex:  99,
      }} ></CloseIcon>
    <ChatBox sx={{
      with:'100%',
    }} idMeeting={idMeeting} />
    </Dialog>
    
    <Box 
      maxWidth="md" 
      m="auto" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 80px)' 
      }}
    >
      {/* Khung video */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {/* ✅ Hiển thị video của người khác */}
        {users
          .filter((u) => u.uid !== uid)
          .map((u) => (
            <VideoPlayer
              key={u.uid}
              user={u}
              avatar= {u.avatar}
              username={u.username || 'Guest'}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ))}

        {/* ✅ Hiển thị video của chính mình (góc phải dưới) */}
        {users
          .filter((u) => u.uid === uid)
          .map((u) => (
            <Box key={u.uid} sx={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 10 }}>
              <VideoPlayer
                user={u}
                avatar= {u.avatar}
                username={u.username || 'Myself'}
                style={{
                  width: '200px',
                  height: '150px',
                  borderRadius: '8px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                }}
              />
              
            </Box>
          ))}
      </Box>

      {/* ✅ Điều khiển */}
      <Box sx={{ padding: '16px' }}>
  <Button 
    variant="contained" 
    onClick={joinRoom}
  >
    Join Room
  </Button>

  <Button 
    variant="outlined" 
    onClick={leaveRoom} 
    sx={{ marginLeft: '8px' }}
  >
    Leave Room
  </Button>

  {/* ✅ Nút Mute Voice */}
  <Button 
    variant="contained"
    onClick={toggleMute}
    sx={{ marginLeft: '8px' }}
    color={isMuted ? 'error' : 'primary'}
  >
    {isMuted ? 'Unmute Voice' : 'Mute Voice'}
  </Button>
</Box>

    </Box>
    </>
  );
};
