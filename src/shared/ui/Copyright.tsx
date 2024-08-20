import { Link } from './Link.tsx';
import Typography from '@mui/material/Typography';
import { TypographyProps } from '@mui/material/Typography/Typography';

type  Props = TypographyProps;
export const Copyright = (props: Props) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/public">
        je bobr kurwa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
