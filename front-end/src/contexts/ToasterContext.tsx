import { ReactNode } from 'react';
import { useContext, useState, createContext } from 'react';
import Snackbar from '@mui/material/Snackbar';

type ToasterType = {
  isOpen: boolean;
  content: string;
};

const toasterState = {
  isOpen: false,
  content: '',
};

const ToasterContext = createContext({
  toasterState,
  setToasterState: ({}: ToasterType) => {}
});

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const [toaster, setToaster] = useState(toasterState);
  
  return (
    <ToasterContext.Provider 
      value={{ 
        toasterState: toaster, 
        setToasterState: setToaster 
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={5000}
        onClose={() => setToaster({ isOpen: false, content: '' })}
        open={toaster.isOpen}
        message={toaster.content}
        key={'general_snackbar'}
      />
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  const toasterContext = useContext(ToasterContext);

  const open = (content: string) => {
    toasterContext.setToasterState({
      isOpen: true,
      content: content
    });
  };
  
  return {
    isOpen: toasterContext.toasterState.isOpen,
    open,
  };
};
