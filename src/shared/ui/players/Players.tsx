import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import { Player } from './Player/Player.tsx';
import { createScene } from '../../api/scenes.ts';
import { Link } from '../Link.tsx';
import { CustomAudioPlayer } from './CustomAudioPlayer.tsx';

type PlayersProps = {
  videoUrl?: string;
  transcriptText?: string;
};

export const Players = ({ videoUrl, transcriptText }: PlayersProps) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const [recordEndTime, setRecordEndTime] = useState<number | null>(null);

  const playerRef = useRef<ReactPlayer | null>(null);
  const canAcceptAudioRef = useRef(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!audioUrl || !isPlay || recordEndTime === null) return;

    const interval = setInterval(() => {
      const current = playerRef.current?.getCurrentTime?.() || 0;
      if (current >= recordEndTime) {
        setIsPlay(false);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlay, audioUrl, recordEndTime]);

  const recorderControls = useAudioRecorder({ echoCancellation: false });

  if (!videoUrl) {
    return null;
  }

  const addAudioElement = (blob: Blob) => {
    if (!canAcceptAudioRef.current) {
      console.log('⛔ Blob rejected — reset is active');
      return;
    }

    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    playerRef.current?.seekTo(0);
  };

  const handleReset = () => {
    canAcceptAudioRef.current = false; // блокируем при reset
    setIsPlay(false);
    setIsRecord(false);
    setRecordStartTime(null);
    setRecordEndTime(null);
    setAudioUrl('');
    setSceneId(null);
    playerRef.current?.seekTo(0);

    // позволяем запись снова после небольшого "тишины"
    setTimeout(() => {
      canAcceptAudioRef.current = true;
    }, 100);
  };

  const handleStartRecording = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setSnackbarMessage('Запись не поддерживается в этом браузере.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const start = playerRef.current?.getCurrentTime?.() || 0;
    setRecordStartTime(start);
    setIsRecord(true);
    setIsPlay(true);

    playerRef.current?.seekTo(start);

    // Ждем немного, чтобы видео успело начать воспроизведение
    setTimeout(() => {
      try {
        recorderControls.startRecording();
      } catch (error) {
        console.error('Error starting recording:', error);
        setSnackbarMessage('Не удалось начать запись.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }, 200);
  };

  const handleStopRecording = () => {
    recorderControls.stopRecording();
    const end = playerRef.current?.getCurrentTime?.() ?? 0;
    setRecordEndTime(end);

    setIsPlay(false);
    setIsRecord(false);
  };

  const handleTogglePauseResume = () => {
    recorderControls.togglePauseResume();
    setIsPlay(recorderControls.isPaused);
  };
  const handleSave = async () => {
    if (!recorderControls.recordingBlob || recordStartTime === null || recordEndTime === null) {
      setSnackbarMessage('Нет записи или начального таймкода.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = {
        youtubeLink: videoUrl ?? '',
        startTimecode: recordStartTime,
        endTimecode: recordEndTime,
        transcript: transcriptText,
        audioFile: new File([recorderControls.recordingBlob], 'recorded-audio.webm', {
          type: recorderControls.recordingBlob.type,
        }),
      };

      const result = await createScene(formData);
      setSceneId(result.sceneId);

      setSnackbarMessage('Сцена успешно сохранена!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Ошибка при сохранении сцены.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const isShowSaveBtn = !!audioUrl && !sceneId;

  console.log('audioUrl', audioUrl);

  return (
    <Stack gap={2}>
      <Stack
        sx={{
          maxWidth: 800,
        }}
      >
        <Player
          controls
          ref={playerRef}
          muted={isRecord || !!audioUrl}
          url={videoUrl}
          playing={isPlay}
          onPause={() => setIsPlay(false)}
          onPlay={() => setIsPlay(true)}
        />
      </Stack>
      {!audioUrl ? (
        <AudioRecorder
          onRecordingComplete={addAudioElement}
          recorderControls={{
            ...recorderControls,
            startRecording: handleStartRecording,
            stopRecording: handleStopRecording,
            togglePauseResume: handleTogglePauseResume,
          }}
        />
      ) : (
        <Button variant="outlined" color="error" disabled={!audioUrl} onClick={handleReset}>
          reset record
        </Button>
      )}
      <Stack gap={2} direction="row">
        {audioUrl && (
          <CustomAudioPlayer
            src={audioUrl}
            playing={isPlay}
            onPlay={() => {
              setIsPlay(true);
              if (recordStartTime !== null) {
                playerRef.current?.seekTo(recordStartTime);
              }
            }}
            onPause={() => setIsPlay(false)}
          />
        )}
        {isShowSaveBtn && <Button onClick={handleSave}>Save</Button>}
        {sceneId && (
          <Button component={Link} variant="outlined" color="primary" href={`/scenes/${sceneId}`}>
            Go to scene
          </Button>
        )}
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
