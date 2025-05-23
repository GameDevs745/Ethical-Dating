import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initDB } from './data/localDatabase';
import { seedInitialUsers } from './data/seedData';
const root = ReactDOM.createRoot(document.getElementById('root'));
initDB()
  .then(() => seedInitialUsers())
  .then(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(error => {
    root.render(
      <div>
        <h1>Initialization Failed</h1>
        <p>{error.message}</p>
      </div>
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
