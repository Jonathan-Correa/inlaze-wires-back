// Interfaces
import { Response } from 'express';
import { IMessage } from '../interfaces/IMessage';
import { IRequest } from '../interfaces/IRequest';

import Message from '../models/Message';
import User from '../models/User';

export const create = async (
  req: IRequest,
  res: Response
): Promise<void | Response> => {
  try {
    let message: IMessage = new Message(req.body);
    message.createdBy = req.user?._id;

    await message.save();
    message = message.toObject();

    message.createdBy = (
      await User.findById(req.user?._id).select('fullName nickname email createdAt _id').lean()
    ) as any;

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(422)
      .json({ message: 'Something went wrong while creating the message' });
  }
};
