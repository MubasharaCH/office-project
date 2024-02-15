import React from 'react';

const Modal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // transform: 'translateX(-50%)', // Center horizontally initially
        zIndex: '50',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        {children}
        <button onClick={onRequestClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
