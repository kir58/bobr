import { Link } from './Link';
import Typography from '@mui/material/Typography';

export const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://bobr.surge.sh/">
        je bobr kurwa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};
