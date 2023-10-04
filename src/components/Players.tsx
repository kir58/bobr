import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { getBlobDuration } from "../utils/getBloblDuration";
import { Button, Stack } from "@mui/material";
import { Player } from "./common/Player/Player";

type Props = {
  videoUrl?: string;
};

export const Players = ({ videoUrl }: Props) => {
  const [isPlay, setIsPlay] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
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
    playerRef.current?.seekTo(0);
    setAudioUrl("");
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

  console.log(Player);
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
        <Button
          variant="outlined"
          color="error"
          disabled={!audioUrl}
          onClick={handleReset}
        >
          reset record
        </Button>
        <audio
          controlsList="nodownload"
          src={audioUrl ?? ""}
          controls
          onPlay={() => {
            setIsPlay(true);
            playerRef.current?.seekTo(0);
          }}
        />
      </Stack>
    </Stack>
  );
};
