import React from 'react';
import { ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import { formatConversationTimestamp } from '../utils/formatDate';

interface ChatListItemProps {
    conversation: IConversation;
    isSelected: boolean;
    onClick: () => void;
}

interface IConversation {
    wa_id: string;
    name: string;
    lastMessage: string;
    lastMessageTimestamp: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, isSelected, onClick }) => {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick} selected={isSelected} sx={{ py: 1.5, borderRadius: 1, m: 0.5 }}>
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#25D366' }}>{conversation.name?.charAt(0) || '?'}</Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography noWrap>{conversation.name}</Typography>}
                    secondary={
                        <Typography noWrap variant="body2" color="text.secondary">
                            {conversation.lastMessage}
                        </Typography>
                    }
                />
                <Box sx={{ textAlign: 'right', ml: 1, minWidth: 64 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        {formatConversationTimestamp(conversation.lastMessageTimestamp)}
                    </Typography>
                </Box>
            </ListItemButton>
        </ListItem>
    );
};

export default ChatListItem;
