import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FaPlay, FaPause, FaHeart, FaFire, FaForward, FaBackward } from "react-icons/fa";
import "./App.css";

const socket = io("http://localhost:5000"); // Your backend URL

const App = () => {
  const [song, setSong] = useState("https://example.com/song.mp3");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(song));

  useEffect(() => {
    socket.on("play", () => handlePlay());
    socket.on("pause", () => handlePause());
    socket.on("changeSong", (newSong) => handleChangeSong(newSong));
    return () => {
      socket.off("play");
      socket.off("pause");
      socket.off("changeSong");
    };
  }, []);

  const handlePlay = () => {
    audio.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      socket.emit("pause");
    } else {
      socket.emit("play");
    }
  };

  const handleChangeSong = (newSong) => {
    audio.pause();
    audio.src = newSong;
    audio.load();
    setSong(newSong);
    socket.emit("changeSong", newSong);
    handlePlay();
  };

  return (
    <div className="app-container">
      <div className="player-card">
        <h2>VibeSync</h2>
        <img
          src="https://example.com/thumbnail.jpg"
          alt="Album Art"
          className="album-art"
        />
        <div className="controls">
          <button onClick={() => handleChangeSong("https://example.com/song2.mp3")}> <FaBackward /> </button>
          <button onClick={togglePlay}> {isPlaying ? <FaPause /> : <FaPlay />} </button>
          <button onClick={() => handleChangeSong("https://example.com/song3.mp3")}> <FaForward /> </button>
        </div>
        <div className="reaction-buttons">
          <button> <FaHeart /> </button>
          <button> <FaFire /> </button>
        </div>
        <div className="lyrics-box">
          <p className="glow-lyrics">"You're the light, you're the night..."</p>
        </div>
      </div>
    </div>
  );
};

export default App;