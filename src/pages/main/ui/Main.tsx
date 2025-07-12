import {  useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Players } from '../../../shared/ui';
import { generateEmbedUrl } from '../../../shared/lib/inks.utils.ts';
const defaultVideoUrl = 'https://www.youtube.com/watch?v=XyuNwy5glug';


export const Main = () => {
  const [searchValue, setSearchValue] = useState(defaultVideoUrl);
  const [videoUrl, setVideoUrl] = useState('');

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
              <Button onClick={() => setVideoUrl(generateEmbedUrl(searchValue))} variant="text">
                Add
              </Button>
            ),
          }}
        />
      </Stack>
      <Players videoUrl={videoUrl} />
    </Stack>
  );
};
