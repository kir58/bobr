import { useEffect, useRef, useState } from 'react';
import { Scene } from '../../../shared/api/scenes.ts';
import { Player } from '../../../shared/ui/players/Player/Player.tsx';
import ReactPlayer from 'react-player/lazy';
import { Box } from '@mui/material';

type Props = {
  scene: Scene
};

function createAudioUrlFromBuffer(buffer: { type: string; data: number[] }, mimeType: string): string {
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
    <Box sx={{ maxWidth: 700, margin: 'auto',  marginTop: 2 }}>
      <Box >
        <Player
          ref={playerRef}
          url={scene.youtubeLink}
          controls
          muted
          playing={isVideoPlaying}
          onProgress={handleVideoProgress}
          width="100%"
          height="270px"
        />
      </Box>

      {audioUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2  } }>
          <audio
            controls
            src={audioUrl}
            onPlay={handleAudioPlay}
          />
        </Box>
      )}
    </Box>
  );
};
