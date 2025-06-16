//

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Modern minimalist component for Toast container
const ToastNotification = ({
  position = "top-right",
  autoClose = 3000,
  hideProgressBar = false, // Mantenemos la barra de progreso visible
  newestOnTop = true,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = "light" // Changed to light theme for minimalist look
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
      toastClassName="modern-toast" // Custom class for styling
    />
  );
};

// Modern minimalist color palette with white and moss green
const TOAST_COLORS = {
  success: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #5a7d60', // Moss green border
    textColor: '#2c3e33', // Dark moss green text
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  error: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #d64545',
    textColor: '#6d2323',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  warning: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #e9b949',
    textColor: '#66501e',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  info: {
    backgroundColor: '#ffffff',
    borderLeft: '4px solid #3d6a58', // Darker moss green
    textColor: '#2c3e33',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  }
};

// Custom CSS to be imported separately
const toastCSS = `
  .modern-toast {
    border-radius: 6px !important;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    padding: 12px 16px !important;
  }
  
  .Toastify__close-button {
    color: #5a7d60 !important;
    opacity: 0.7;
  }
  
  .Toastify__progress-bar {
    height: 3px !important;
    background: linear-gradient(to right, #5a7d60, #3d6a58) !important;
    opacity: 0.7;
  }
  
  .Toastify__toast-icon {
    margin-right: 12px;
  }
`;

// Functions to display different types of toasts
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

// Asegurarse de que la barra de progreso se muestre correctamente
const customProgressBarStyles = {
  success: '#5a7d60',
  error: '#d64545',
  warning: '#e9b949',
  info: '#3d6a58'
};

// Add style tag to document head
const injectStyle = () => {
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(toastCSS));
  document.head.appendChild(styleEl);
};

// Call this function when your app initializes
// injectStyle();

export { ToastNotification, showToast, injectStyle };