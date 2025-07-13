import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { getBlobDuration } from '../../lib/getBloblDuration.ts';
import { Button, Stack, Snackbar, Alert } from '@mui/material';
import { Player } from './Player/Player.tsx';
import { createScene } from '../../api/scenes.ts';
import { Link } from '../Link.tsx';

type PlayersProps = {
  videoUrl?: string;
  defaultAudioUrl?: string;
  defaultStartTimecode?: number;
  defaultEndTimecode?: number;
  defaultTranscript?: string;
};

export const Players = ({
  videoUrl,
  defaultAudioUrl = '',
  defaultStartTimecode = 0,
}: PlayersProps) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState(defaultAudioUrl);
  const [videoSeconds, setVideoSeconds] = useState(defaultStartTimecode);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);

  const playerRef = useRef<ReactPlayer | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!audioUrl) return;
    if (isPlay) {
      getBlobDuration(audioUrl).then((duration) => {
        if (videoSeconds >= duration) {
          setIsPlay(false);
          setVideoSeconds(defaultStartTimecode);
        }
      });
    }
  }, [isPlay, audioUrl, videoSeconds, defaultStartTimecode]);

  const recorderControls = useAudioRecorder({ echoCancellation: false });

  if (!videoUrl) {
    return null;
  }

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    playerRef.current?.seekTo(0);
  };

  const handleReset = () => {
    setIsPlay(false);
    setIsRecord(false);
    setRecordStartTime(null);
    playerRef.current?.seekTo(0);
    setAudioUrl(defaultAudioUrl);
    setVideoSeconds(defaultStartTimecode);
  };

  const handleStartRecording = () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setSnackbarMessage('Запись не поддерживается в этом браузере.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const start = playerRef.current?.getCurrentTime?.() || 0;
    setRecordStartTime(start);

    try {
      recorderControls.startRecording();
      setIsPlay(true);
      setIsRecord(true);
      playerRef.current?.seekTo(start);
    } catch (error) {
      console.error('Error starting recording:', error);
      setSnackbarMessage('Не удалось начать запись.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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

  const handleSave = async () => {
    if (!recorderControls.recordingBlob || recordStartTime === null) {
      setSnackbarMessage('Нет записи или начального таймкода.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = {
        youtubeLink: videoUrl ?? '',
        startTimecode: recordStartTime,
        endTimecode: recordStartTime + Math.floor(videoSeconds),
        transcript: '',
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

  return (
    <Stack gap={2} marginTop={5}>
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
          onProgress={(proggress) => {
            setVideoSeconds(proggress.playedSeconds);
          }}
        />
      </Stack>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={{
          ...recorderControls,
          startRecording: handleStartRecording,
          stopRecording: handleStopRecording,
          togglePauseResume: handleTogglePauseResume,
        }}
      />
      <Stack gap={2} direction="row">
        <Button variant="outlined" color="error" disabled={!audioUrl} onClick={handleReset}>
          reset record
        </Button>
        <audio
          controlsList="nodownload"
          src={audioUrl ?? ''}
          controls
          onPlay={() => {
            setIsPlay(true);
            playerRef.current?.seekTo(0);
          }}
        />
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
