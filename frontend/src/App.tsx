import React from 'react';
import { AppRouter } from './app/router';
import { AuthProvider } from './features/auth/context/AuthContext';
import './styles/globals.css';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;