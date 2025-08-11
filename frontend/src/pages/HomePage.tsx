import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useChat } from '../context/ChatContext';

const HomePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { selectedConversation } = useChat();

    if (isMobile) {
        return (
            <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex' }}>
                {selectedConversation ? <ChatWindow /> : <Sidebar />}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Box
                sx={{
                    width: { xs: '100%', sm: '30%' },
                    minWidth: { sm: 320 },
                    maxWidth: { sm: 520 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid #e0e0e0',
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Sidebar />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: theme.palette.background.default,
                }}
            >
                <ChatWindow />
            </Box>
        </Box>
    );
};

export default HomePage;
