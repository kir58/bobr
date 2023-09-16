import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { getBlobDuration } from '../utils/getBloblDuration';
import '../Main.css';
const defaultVideoUrl = 'https://www.youtube.com/watch?v=Rm2KZLY-nTs';

export const Main = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [videoSeconds, setVideoSeconds] = useState(0);

  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    if (isPlay) {
      getBlobDuration(audioUrl).then((duration) => {
        if (videoSeconds >= duration) {
          setIsPlay(false);
          setVideoSeconds(0);
        }
      });
    }
  }, [isPlay, audioUrl, videoSeconds]);

  const recorderControls = useAudioRecorder();

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    playerRef.current?.seekTo(0);
  };

  const handleReset = () => {
    setIsPlay(false);
    setIsRecord(false);
    playerRef.current?.seekTo(0);
    setAudioUrl('');
    setVideoSeconds(0);
  };

  const handleStartRecording = () => {
    recorderControls.startRecording();
    setIsPlay(true);
    setIsRecord(true);
    playerRef.current?.seekTo(0);
  };

  const handleStopRecording = () => {
    recorderControls.stopRecording();
    setIsPlay(false);
    setIsRecord(false);
  };

  const handleTogglePauseResume = () => {
    recorderControls.togglePauseResume();
    setIsPlay(recorderControls.isPaused);
  };

  return (
    <div className="wrapper">
      <div>Привет Папаша! А нука скажи что нибудь по польски.</div>
      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          width="100%"
          height="100%"
          controls
          ref={playerRef}
          muted={isRecord || !!audioUrl}
          url={defaultVideoUrl}
          playing={isPlay}
          onPause={() => setIsPlay(false)}
          onPlay={() => setIsPlay(true)}
          onProgress={(proggress) => {
            setVideoSeconds(proggress.playedSeconds);
          }}
        />
      </div>

      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={{
          ...recorderControls,
          startRecording: handleStartRecording,
          stopRecording: handleStopRecording,
          togglePauseResume: handleTogglePauseResume,
        }}
      />
      <div className="audioWrapper">
        <button className="button danger" disabled={!audioUrl} onClick={handleReset}>
          reset record
        </button>
        <audio
          controlsList="nodownload"
          src={audioUrl ?? ''}
          controls
          onPlay={() => {
            playerRef.current?.seekTo(0);
            setIsPlay(true);
          }}
        />
      </div>
    </div>
  );
};
