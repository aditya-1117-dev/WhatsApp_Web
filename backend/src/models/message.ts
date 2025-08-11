import { Schema, model, Document } from 'mongoose';

interface IMessage extends Document {
    from: string;
    id: string;
    timestamp: string;
    text: {
        body: string;
    };
    type: string;
    wa_id: string;
    name: string;
    status: string;
}

const messageSchema = new Schema<IMessage>({
    from: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    text: {
        body: { type: String, required: true }
    },
    type: { type: String, required: true },
    wa_id: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, default: 'sent' }
});

const Message = model<IMessage>('processed_messages', messageSchema);

export default Message;