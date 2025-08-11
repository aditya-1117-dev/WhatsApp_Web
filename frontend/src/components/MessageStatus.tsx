import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

type StatusType = 'sent' | 'delivered' | 'read';

interface MessageStatusProps {
    status: StatusType;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
    const iconStyle = { fontSize: 16, marginLeft: 4 };
    const readColor = '#53bdeb';

    if (status === 'sent') return <DoneIcon sx={iconStyle} />;
    if (status === 'delivered') return <DoneAllIcon sx={iconStyle} />;
    if (status === 'read') return <DoneAllIcon sx={{ ...iconStyle, color: readColor }} />;
    return null;
};

export default MessageStatus;
