import React, { useRef, useEffect } from 'react'
import {useSocket} from '../contexts/SocketContext'


const AudioPlayer = ({track}) => {
    const audioRef = useRef(null);
    const socket = useSocket();

    useEffect(() => {
        socket.on('sync', ({action, timestamp}) => {
            if (action === 'play') {
                audioRef.current.currentTime = timestamp;
                audioRef.current.play();
            } else if(action === 'pause'){
                audioRef.current.pause();
            }
        });

        return () => socket.off('sync');
        
    }, [socket])

    const handlePlay = ()=> {
        const timestamp = audioRef.current.currentTime;
        socket.emit('sync', {action : 'play', timestamp});
    };

    const handlePause = () => {
        socket.emit('sync', {action : 'pause'});
    };

    return (
        <div>
            <audio ref={audioRef} src={track.url} onPlay={handlePlay} onPause={handlePause} />
            <button onClick={() => audioRef.current.play()}>Play</button>
            <button onClick={() => audioRef.current.pause()}>Pause</button>
        </div>
    );
}

export default AudioPlayer;