import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToasterProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

// Simple helper to show toast notifications
export const showToast = {
  success: (message, title = 'Success') => {
    toast.success(message, { 
      autoClose: 3000,
      position: "top-right"
    });
  },
  error: (message, title = 'Error') => {
    toast.error(message, { 
      autoClose: 3000,
      position: "top-right"
    });
  },
  info: (message, title = 'Info') => {
    toast.info(message, { 
      autoClose: 3000,
      position: "top-right"
    });
  },
  warning: (message, title = 'Warning') => {
    toast.warning(message, { 
      autoClose: 3000,
      position: "top-right"
    });
  }
};
