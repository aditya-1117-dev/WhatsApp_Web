import React, {useState, useRef, useEffect, Fragment} from 'react';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    Avatar,
    TextField,
    IconButton,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';

const ChatWindow: React.FC = () => {
    const { selectedConversation, messages, loading, sendMessage, selectConversation } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const scrollToBottom = () => {
        (messagesEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (newMessage.trim()) {
            sendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    if (!selectedConversation) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                    bgcolor: theme.palette.background.default,
                    width: '100%',
                }}
            >
                <img
                    src="https://media.wired.com/photos/65c256bc5acbfbe155ad319e/3:2/w_2560%2Cc_limit/WhatsApp-Interoperabiltiy-Security.jpg"
                    alt="WhatsApp Connect"
                    width="250"
                />
                <Typography variant="h4" sx={{ mt: 2, color: theme.palette.text.primary }}>
                    WhatsApp Web
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
                    Send and receive messages without keeping your phone online.
                    <br />
                    Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                minWidth: 0,
                bgcolor: theme.palette.background.default,
            }}
        >
            <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: theme.palette.background.paper }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton edge="start" color="inherit" onClick={() => selectConversation(null)} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Avatar sx={{ mr: 2, bgcolor: '#25D366' }}>{selectedConversation.name?.charAt(0) || '?'}</Avatar>
                    <Box>
                        <Typography variant="h6" noWrap>{selectedConversation.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {selectedConversation.wa_id}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: { xs: 1, sm: 2, md: 3 },
                    backgroundColor: theme.palette.mode === 'dark' ? '#0b141a' : '#e5ddd5',
                    backgroundImage: 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    messages.map((msg) => (
                        <Fragment key={msg._id}>
                            <MessageBubble message={msg} />
                        </Fragment>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                sx={{
                    p: 1,
                    bgcolor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderTop: '1px solid #e0e0e0',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    size="small"
                    autoComplete="off"
                    sx={{
                        bgcolor: theme.palette.background.default,
                        '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                    }}
                />
                <IconButton type="submit" color="primary">
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;
