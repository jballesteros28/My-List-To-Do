import React from 'react';
import '../styles/Auth.css';

const NeuInput = ({ type, placeholder, value, onChange, name }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    name={name}
    className="neu-input"
    required
  />
);

export default NeuInput;
