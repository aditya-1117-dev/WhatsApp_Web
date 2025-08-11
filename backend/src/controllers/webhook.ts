import { Request, Response } from 'express';
import Message from '../models/message';

export const processWebhook = async (req: Request, res: Response) => {
    const payload = req.body;
    const io = req.io;

    try {
        const entry = payload.metaData.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        if (value.messages) {
            const messageData = value.messages[0];
            const contact = value.contacts[0];
            const newMessage = new Message({
                from: messageData.from,
                id: messageData.id,
                timestamp: messageData.timestamp,
                text: messageData.text,
                type: messageData.type,
                wa_id: contact.wa_id,
                name: contact.profile.name,
            });
            try {
                const savedMessage : any = await newMessage.save();
                io.emit('newMessage', savedMessage);
                return res.status(201).json({ status: 'success', message: 'Message processed and saved' });
            } catch (error: any) {
                if (error.code === 11000) {
                    return res.status(200).json({ status: 'success', message: 'Duplicate message ignored' });
                }
                throw error;
            }
        } else if (value.statuses) {
            const statusData = value.statuses[0];
            const messageId = statusData.id;
            const newStatus = statusData.status;
            const updatedMessage = await Message.findOneAndUpdate(
                { id: messageId },
                { status: newStatus },
                { new: true }
            );
            if (updatedMessage) {
                io.emit('messageStatusUpdate', { id: messageId, status: newStatus } as any);
                return res.status(200).json({ status: 'success', message: 'Status updated' });
            } else {
                return res.status(200).json({ status: 'success', message: 'Status update for non-tracked message ignored.' });
            }
        } else {
            return res.status(400).json({ status: 'error', message: 'Invalid payload structure: no messages or statuses found' });
        }
    } catch (error: any) {
        console.error('Error processing webhook:', error.message);
        console.error('Payload:', JSON.stringify(payload, null, 2));
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};