
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  localStorage.setItem("theme", savedTheme); // Ensure theme is saved
};

// Run once on app initialization
initializeTheme();

// Set up theme persistence
window.addEventListener('storage', (e) => {
  if (e.key === 'theme') {
    document.documentElement.classList.toggle("dark", e.newValue === "dark");
  }
});

// Create global theme toggle function
window.toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.classList.toggle("dark", newTheme === "dark");
  localStorage.setItem("theme", newTheme);
  
  // Dispatch event to notify other tabs/windows
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'theme',
    newValue: newTheme,
    oldValue: currentTheme,
    storageArea: localStorage
  }));
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// For TypeScript
declare global {
  interface Window {
    toggleTheme: () => void;
  }
}
