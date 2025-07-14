import { useEffect, useRef, useState } from 'react';
import { Scene } from '../../../shared/api/scenes.ts';
import { Player } from '../../../shared/ui/players/Player/Player.tsx';
import ReactPlayer from 'react-player/lazy';
import { Box, TextField } from '@mui/material';

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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (scene.audioData && scene.audioMimeType) {
      const url = createAudioUrlFromBuffer(scene.audioData, scene.audioMimeType);
      setAudioUrl(url);
    }
  }, [scene.audioData, scene.audioMimeType]);

  const handleAudioPlay = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(scene.startTimecode, 'seconds');
      setIsVideoPlaying(true);
    }
  };

  const handleVideoProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (playedSeconds >= scene.endTimecode) {
      setIsVideoPlaying(false);
    }
  };

  return (
    <Box sx={{ margin: 'auto', marginTop: 2 }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'stretch' }}>
        <Box sx={{ flex: '2 1 0%', minWidth: 0 }}>
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
        <TextField
          value={scene.transcript}
          disabled
          label="Тбилиский модник"
          placeholder="Здесь может быть транскрипт"
          fullWidth
          multiline
          rows={16}
          variant="outlined"
          sx={{
            width: 450,
            '& textarea': {
              resize: 'both',
              overflow: 'auto',
            },
          }}
        />
      </Box>

      {audioUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <audio controls src={audioUrl} onPlay={handleAudioPlay} />
        </Box>
      )}
    </Box>
  );
};
