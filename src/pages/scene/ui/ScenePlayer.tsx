import { useEffect, useRef, useState } from 'react';
import { Scene } from '../../../shared/api/scenes.ts';
import { Player } from '../../../shared/ui/players/Player/Player.tsx';
import ReactPlayer from 'react-player/lazy';
import { Box, TextField } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import H5AudioPlayer from 'react-h5-audio-player';

type Props = {
  scene: Scene;
};

function createAudioUrlFromBuffer(
  buffer: { type: string; data: number[] },
  mimeType: string,
): string {
  const uint8Array = new Uint8Array(buffer.data);
  const blob = new Blob([uint8Array], { type: mimeType });
  return URL.createObjectURL(blob);
}

export const ScenePlayer = ({ scene }: Props) => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const audioRef = useRef<H5AudioPlayer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (scene.audioData && scene.audioMimeType) {
      const url = createAudioUrlFromBuffer(scene.audioData, scene.audioMimeType);
      setAudioUrl(url);
    }
  }, [scene.audioData, scene.audioMimeType]);

  const handleAudioPlay = () => {
    if (playerRef.current && audioRef.current) {
      const currentTime = audioRef.current.audio.current?.currentTime ?? 0;
      playerRef.current.seekTo(currentTime, 'seconds');
      setIsVideoPlaying(true);
    }
  };

  const handleVideoProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (playedSeconds >= scene.endTimecode) {
      setIsVideoPlaying(false);
    }
  };

  // Sync video time with audio
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && playerRef.current) {
        const audioTime = audioRef.current.audio.current?.currentTime ?? 0;
        const videoTime = playerRef.current.getCurrentTime();
        const diff = Math.abs(videoTime - audioTime);

        if (diff > 0.3) {
          playerRef.current.seekTo(audioTime, 'seconds');
        }
      }
    }, 500); // check twice a second

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ margin: 'auto', marginTop: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Player
            ref={playerRef}
            url={scene.youtubeLink}
            controls
            muted
            playing={isVideoPlaying}
            onProgress={handleVideoProgress}
            width="100%"
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            value={scene.transcript}
            disabled
            label="Тбилиский модник"
            placeholder="Здесь может быть транскрипт"
            fullWidth
            multiline
            variant="outlined"
            sx={{
              height: '100%',
              '& textarea': {
                resize: 'both',
                overflow: 'auto',
                minHeight: 150,
              },
            }}
          />
        </Box>
      </Box>

      {audioUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <AudioPlayer
            ref={audioRef}
            showJumpControls={false}
            src={audioUrl}
            onPlay={handleAudioPlay}
          />
        </Box>
      )}
    </Box>
  );
};
