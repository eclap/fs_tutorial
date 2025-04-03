import { useContext, useState, createContext } from 'react';
import { ReactNode } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const GlobalLoadingContext = createContext({
  isLoading: false,
  setIsLoading: ({}: boolean) => {} 
});

export const GlobalLoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{isLoading, setIsLoading}}>
      {children}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
        onClick={() => setIsLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const globalLoadingContext = useContext(GlobalLoadingContext);

  return {
    isLoading: globalLoadingContext.isLoading,
    setIsLoading: globalLoadingContext.setIsLoading
  };
};
