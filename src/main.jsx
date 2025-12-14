import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Mock window.storage API
window.storage = {
    get: async (key) => {
        const value = localStorage.getItem(key);
        if (value === null) {
            throw new Error('Key not found');
        }
        return { value };
    },
    set: async (key, value) => {
        localStorage.setItem(key, value);
        return;
    }
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
