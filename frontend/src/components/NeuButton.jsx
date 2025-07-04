import React from 'react';
import '../styles/Auth.css';

const NeuButton = ({ children, onClick, type = 'submit' }) => (
  <button className="neu-button" onClick={onClick} type={type}>
    {children}
  </button>
);

export default NeuButton;
