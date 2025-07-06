import {  useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Players } from '../../../shared/ui';
const defaultVideoUrl = 'https://www.youtube.com/watch?v=XyuNwy5glug';


export const Main = () => {
  const [searchValue, setSearchValue] = useState(defaultVideoUrl);
  const [videoUrl, setVideoUrl] = useState('');
  // вынести в метод
  // Генерация YouTube embed-ссылки из обычной
  let embedUrl = videoUrl
  if (!embedUrl.includes('embed')) {
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      embedUrl = `https://www.youtube.com/embed/${match[1]}?rel=0&controls=1`;
    }
  }

  return (
    <Stack gap={2} marginTop={5}>
      <Stack gap={2} direction="row" alignItems="center">
        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          label="Video Url"
          placeholder="Add video url"
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <Button onClick={() => setVideoUrl(searchValue)} variant="text">
                Add
              </Button>
            ),
          }}
        />
      </Stack>
      <Players videoUrl={embedUrl} />
    </Stack>
  );
};
