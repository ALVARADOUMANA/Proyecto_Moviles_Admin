import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modern minimalist component for Toast container
const ToastNotification = ({
  position = "top-right",
  autoClose = 3000,
  hideProgressBar = false,
  newestOnTop = true,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = "light"
}) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      toastClassName="modern-toast"
    />
  );
};

// Updated color palette with blue colors
const TOAST_COLORS = {
  success: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #2563EB', // Blue border
    textColor: '#1E3A8A', // Dark blue text
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  error: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #DC2626', // Red border
    textColor: '#7F1D1D', // Dark red text
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  warning: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #D97706', // Amber border
    textColor: '#78350F', // Dark amber text
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  info: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #1D4ED8', // Darker blue
    textColor: '#1E3A8A',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  }
};

// Custom CSS with blue color scheme
const toastCSS = `
  .modern-toast {
    border-radius: 6px !important;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    padding: 12px 16px !important;
  }
  
  .Toastify__close-button {
    color: #2563EB !important;
    opacity: 0.7;
  }
  
  .Toastify__progress-bar {
    height: 3px !important;
    background: linear-gradient(to right, #2563EB, #1D4ED8) !important;
    opacity: 0.7;
  }
  
  .Toastify__toast-icon {
    margin-right: 12px;
  }
`;

// Toast functions with blue color scheme
const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      style: {
        backgroundColor: TOAST_COLORS.success.backgroundColor,
        color: TOAST_COLORS.success.textColor,
        boxShadow: TOAST_COLORS.success.boxShadow,
        borderLeft: TOAST_COLORS.success.borderLeft
      },
      progressClassName: 'success-progress-bar',
      hideProgressBar: false,
      ...options
    });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, {
      style: {
        backgroundColor: TOAST_COLORS.error.backgroundColor,
        color: TOAST_COLORS.error.textColor,
        boxShadow: TOAST_COLORS.error.boxShadow,
        borderLeft: TOAST_COLORS.error.borderLeft
      },
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    return toast.warning(message, {
      style: {
        backgroundColor: TOAST_COLORS.warning.backgroundColor,
        color: TOAST_COLORS.warning.textColor,
        boxShadow: TOAST_COLORS.warning.boxShadow,
        borderLeft: TOAST_COLORS.warning.borderLeft
      },
      ...options
    });
  },
  
  info: (message, options = {}) => {
    return toast.info(message, {
      style: {
        backgroundColor: TOAST_COLORS.info.backgroundColor,
        color: TOAST_COLORS.info.textColor,
        boxShadow: TOAST_COLORS.info.boxShadow,
        borderLeft: TOAST_COLORS.info.borderLeft
      },
      ...options
    });
  }
};

// Add style tag to document head
const injectStyle = () => {
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(toastCSS));
  document.head.appendChild(styleEl);
};

export { ToastNotification, showToast, injectStyle };