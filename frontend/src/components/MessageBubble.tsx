import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { formatTimestamp } from '../utils/formatDate';
import MessageStatus from './MessageStatus';

interface IMessage {
    _id: string;
    from: string;
    id: string;
    timestamp: string;
    text: { body: string };
    type: string;
    wa_id: string;
    name: string;
    status: 'sent' | 'delivered' | 'read';
}

interface MessageBubbleProps {
    message: IMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const theme = useTheme();
    const isSentByMe = message.from !== message.wa_id;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
                mb: 1,
                px: { xs: 0.5, sm: 0 },
            }}
        >
            <Box
                sx={{
                    bgcolor: isSentByMe ? '#dcf8c6' : theme.palette.background.paper,
                    borderRadius: 2,
                    p: '8px 12px',
                    maxWidth: { xs: '85%', md: '70%' },
                    boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    overflowWrap: 'anywhere',
                }}
            >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text.body}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                        {formatTimestamp(message.timestamp)}
                    </Typography>
                    {isSentByMe && <MessageStatus status={message.status} />}
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(MessageBubble);
