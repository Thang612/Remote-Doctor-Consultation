import { Avatar } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user, isLocal, username, style, avatar }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (user.videoTrack) {
      user.videoTrack.play(videoRef.current);
    }

    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();
      }
    };
  }, [user.videoTrack]);


  return (
    <div style={{ ...style,  borderRadius: '8px', overflow: 'hidden' }}>
      {/* Hiển thị video */}
      <div ref={videoRef} style={{ width: '100%', height: '100%' }} />

      {/* Hiển thị username */}
      <div style={{
        display:'flex',
        alignItems: 'center',
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 10,
      }}>
         <Avatar 
                  src={avatar} 
                  sx={{ width: 28, height: 28, marginRight: '8px' }} 
                />
        {username}
      </div>
    </div>
  );
};

