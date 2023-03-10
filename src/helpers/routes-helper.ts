// Interfaces
import { NextFunction, Response } from 'express';
import { IRequest } from '../interfaces/IRequest';

export const allowAccess = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<Response | NextFunction | undefined> => {
  if (!req.isAuthenticated() || !req.user)
    return res.status(401).json({ message: 'No estás autorizado' });

  next();
};