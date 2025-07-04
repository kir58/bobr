import {  useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Players } from '../../../shared/ui';
const defaultVideoUrl = 'https://www.youtube.com/embed/JqU1Qpx-7T4?rel=0&controls=1';


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
              <Button onClick={() => setVideoUrl(searchValue)} variant="text">
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
