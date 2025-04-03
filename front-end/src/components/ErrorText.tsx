import {
  Typography,
} from '@mui/material';

export const ErrorText = ({ errors }: { errors: string[] }) => {
  return (
    <>
      {
        errors.map(error => {
          return (
            <Typography key={error} color="red">
              {error}
            </Typography>
          );
        })
      }
    </>
  );
};
