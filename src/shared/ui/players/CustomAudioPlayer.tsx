import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

type CustomAudioPlayerProps = {
  src: string;
  playing: boolean;
  onPlay?: () => void;
  onPause?: () => void;
};

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const CustomAudioPlayer = ({ src, playing, onPlay, onPause }: CustomAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(playing);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(playing);
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    if (onPlay) audio.addEventListener('play', onPlay);
    if (onPause) audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      if (onPlay) audio.removeEventListener('play', onPlay);
      if (onPause) audio.removeEventListener('pause', onPause);
    };
  }, [onPlay, onPause]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      onPause?.();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * (audioRef.current?.duration || 0);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1,
        borderRadius: 2,
        maxWidth: 400,
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <IconButton
        onClick={togglePlay}
        color="primary"
        size="large"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
      </IconButton>
      <Box
        sx={{ flexGrow: 1, cursor: 'pointer' }}
        onClick={handleProgressClick}
        aria-label="progress bar"
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 1,
            backgroundColor: '#eee',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#1976d2',
            },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'right', userSelect: 'none' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Typography>
      <audio ref={audioRef} src={src} style={{ display: 'none' }} />
    </Box>
  );
};
