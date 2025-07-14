import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useUser } from '../../../entities/user/useUser.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScenes, deleteScene, Scene } from '../../../shared/api/scenes.ts';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, Navigate } from 'react-router-dom';

export const User = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: scenes, isLoading: isLoadingScenes } = useQuery<Scene[]>({
    queryKey: ['scenes'],
    queryFn: getScenes,
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteScene(id),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ['scenes'] });
    },
  });

  if (isLoadingUser || (user?.id && isLoadingScenes)) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Грузит грузит</Typography>;
  }

  if (!user) {
    return <Navigate to={'/'} />;
  }

  const userScenes = scenes?.filter((scene) => scene.userId === user.id) || [];

  return (
    <Box sx={{ maxWidth: 800, margin: '40px auto' }}>
      <Paper elevation={3} sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Профиль пользователя
        </Typography>
        <Typography variant="body1">
          <strong>ID:</strong> {user.id}
        </Typography>
        <Typography variant="body1">
          <strong>Имя пользователя:</strong> {user.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Ваши сцены</Typography>
          {deletingId && <CircularProgress size={24} />}
        </Box>

        <List>
          {userScenes.length === 0 ? (
            <Typography variant="body2">Сцен пока нет.</Typography>
          ) : (
            userScenes.map((scene) => (
              <div key={scene._id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      disabled={deletingId === scene._id}
                      onClick={() => deleteMutation.mutate(scene._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Link
                        to={`/scenes/${scene._id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {scene.youtubeTitle ? scene.youtubeTitle : scene.youtubeLink}
                      </Link>
                    }
                    secondary={`Таймкод: ${scene.startTimecode}s – ${scene.endTimecode}s`}
                  />
                </ListItem>
                <Divider />
              </div>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};
