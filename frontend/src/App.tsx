import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ChatProvider } from './context/ChatContext';
import HomePage from './pages/HomePage';

const theme = createTheme({
    palette: {
        background: {
            default: '#f0f2f5',
        },
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ChatProvider>
                <HomePage />
            </ChatProvider>
        </ThemeProvider>
    );
};

export default App;