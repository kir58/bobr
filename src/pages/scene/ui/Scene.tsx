import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSceneById, Scene as ScenceType } from '../../../shared/api/scenes.ts';
import { ScenePlayer } from './ScenePlayer.tsx';


export const Scene = () => {
  const { scene_id } = useParams<{ scene_id: string }>();
  const [scene, setScene] = useState<ScenceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scene_id) return;

    getSceneById(scene_id)
      .then((data) => {
        setScene(data);
      })
      .catch((err) => {
        console.error('Ошибка при получении сцены:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [scene_id]);

  if (loading) return <div>Загрузка...</div>;
  if (!scene) return <div>Сцена не найдена.</div>;


  return (
    <ScenePlayer scene={scene}/>
  );
};
