import { ReactMediaRecorder } from 'react-media-recorder';
import { Button, Stack, Typography } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

type AudioControlsProps = {
  onStart: (startTime: number) => void;
  onStop: (endTime: number, blob: Blob, blobUrl: string) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
  setIsPlaying: (v: boolean) => void;
  getCurrentTime: () => number;
  seekTo: (t: number) => void;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

export const AudioControls = ({
  onStart,
  onStop,
  isRecording,
  setIsRecording,
  setIsPlaying,
  getCurrentTime,
  seekTo,
}: AudioControlsProps) => {
  const hasStartedRef = useRef(false);
  const [recordTime, setRecordTime] = useState(0);

  // Таймер записи
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer!);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Сброс времени при остановке
  useEffect(() => {
    if (!isRecording) setRecordTime(0);
  }, [isRecording]);

  return (
    <ReactMediaRecorder
      audio
      onStop={(blobUrl, blob) => {
        const end = getCurrentTime();
        onStop(end, blob, blobUrl);
      }}
      render={({ startRecording, stopRecording, status }) => (
        <Stack gap={1}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Button
              onClick={() => {
                const start = getCurrentTime();
                onStart(start);
                setIsRecording(true);
                setIsPlaying(true);
                seekTo(start);

                setTimeout(() => {
                  try {
                    startRecording();
                    hasStartedRef.current = true;
                  } catch (err) {
                    console.error('Error starting recording:', err);
                  }
                }, 200);
              }}
              disabled={isRecording}
            >
              Start
            </Button>
            <Button
              onClick={() => {
                if (!hasStartedRef.current) return;
                setIsRecording(false);
                setIsPlaying(false);
                stopRecording();
              }}
              disabled={!isRecording}
            >
              Stop
            </Button>

            <Typography variant="body1">
              {status === 'recording' && (
                <span style={{ color: 'red' }}>🔴 Recording... ({formatTime(recordTime)})</span>
              )}
              {status === 'stopped' && '⏸ Stopped'}
              {status === 'idle' && '✅ Ready for record'}
            </Typography>
          </Stack>
        </Stack>
      )}
    />
  );
};
