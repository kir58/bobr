import { useState } from 'react';
import { Button, Stack, TextField, Box } from '@mui/material';
import { Players } from '../../../shared/ui';
import { generateEmbedUrl } from '../../../shared/lib/inks.utils.ts';

const defaultVideoUrl = 'https://www.youtube.com/watch?v=XyuNwy5glug';

export const Main = () => {
  const [searchValue, setSearchValue] = useState(defaultVideoUrl);
  const [videoUrl, setVideoUrl] = useState('');
  const [transcriptText, setTranscriptText] = useState('');

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
      {videoUrl && (
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="stretch">
          <Box flex={1}>
            <Players videoUrl={videoUrl} transcriptText={transcriptText} />
          </Box>

          <Box flex={1} display="flex" flexDirection="column" borderRadius={3}>
            <TextField
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              label="Ener transcript"
              placeholder="Напишите текст о горизонтальной квир комуне"
              fullWidth
              multiline
              rows={10}
              variant="outlined"
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
