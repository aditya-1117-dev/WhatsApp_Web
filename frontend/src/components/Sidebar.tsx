import React, {Fragment} from 'react';
import {Box, List, Typography, AppBar, Toolbar} from '@mui/material';
import { useChat } from '../context/ChatContext';
import ChatListItem from './ChatListItem';
import { useTheme } from '@mui/material/styles';

const Sidebar: React.FC = () => {
    const { conversations, selectedConversation, selectConversation } = useChat();
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: theme.palette.background.default }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        WhatsApp
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ overflowY: 'auto', flex: 1 }}>
                <List disablePadding>
                    {conversations.map((convo) => (
                        <Fragment key={convo.wa_id}>
                            <ChatListItem
                                conversation={convo}
                                isSelected={selectedConversation?.wa_id === convo.wa_id}
                                onClick={() => selectConversation(convo)}
                            />
                        </Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default Sidebar;
