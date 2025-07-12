import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSceneById, Scene as SceneType } from '../../../shared/api/scenes.ts';
import { ScenePlayer } from './ScenePlayer.tsx';

import { CircularProgress, Box, Alert } from '@mui/material';

export const Scene = () => {
  const { scene_id } = useParams<{ scene_id: string }>();
  const [scene, setScene] = useState<SceneType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scene_id) return;

    getSceneById(scene_id)
      .then((data) => {
        setScene(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [scene_id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!scene) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">{error ?? "Сцена не найдена"}</Alert>
      </Box>
    );
  }

  return <ScenePlayer scene={scene} />;
};
