import React from 'react';
import ReactDOM from 'react-dom/client';
import { loadConfig } from './constants';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create the root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));


// Load the config before rendering the app
loadConfig().then(() => {
  // After the config is loaded, render the React app
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch((error) => {
  console.error("Failed to load config, app won't start:", error);
});

