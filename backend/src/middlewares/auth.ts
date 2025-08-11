import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers.authorization;

    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};