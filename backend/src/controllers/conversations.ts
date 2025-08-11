import { Request, Response } from 'express';
import Message from '../models/message';
import { v4 as uuidv4 } from 'uuid';

export const getConversations = async (req: Request, res: Response) => {
    try {
        const conversations = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$wa_id',
                    name: { $first: '$name' },
                    lastMessage: { $first: '$text.body' },
                    lastMessageTimestamp: { $first: '$timestamp' },
                }
            },
            {
                $project: {
                    _id: 0,
                    wa_id: '$_id',
                    name: 1,
                    lastMessage: 1,
                    lastMessageTimestamp: 1,
                }
            },
            { $sort: { lastMessageTimestamp: -1 } }
        ]);
        res.status(200).json(conversations);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
};

export const getMessagesByWaId = async (req: Request, res: Response) => {
    try {
        const { wa_id } = req.params;
        const messages : any = await Message.find({ wa_id: wa_id }).sort({ timestamp: 'asc' });
        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this user.' });
        }
        res.status(200).json(messages);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    const io = req.io;
    const { wa_id, text, name } = req.body;

    if (!wa_id || !text || !name) {
        return res.status(400).json({ message: 'wa_id, text, and name are required' });
    }

    try {
        const newMessage = new Message({
            from: process.env.BUSINESS_PHONE_NUMBER || '918329446654',
            id: `wamid.${uuidv4()}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            text: { body: text },
            type: 'text',
            wa_id: wa_id,
            name: name,
            status: 'sent',
        });

        const savedMessage : any = await newMessage.save();

        io.emit('newMessage', savedMessage);
        res.status(201).json(savedMessage);
    } catch (error: any) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};