import { format, isToday, isYesterday } from 'date-fns';

export const formatTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return format(date, 'p');
};

export const formatConversationTimestamp = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    if (isToday(date)) {
        return format(date, 'p');
    }
    if (isYesterday(date)) {
        return 'Yesterday';
    }
    return format(date, 'P');
};