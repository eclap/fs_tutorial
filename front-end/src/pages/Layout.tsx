import { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from '@mui/material';
export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            Tasks
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <Box mt={4}>
      {children}
    </Box>
    </>
  );
};
