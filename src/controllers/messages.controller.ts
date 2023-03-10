// Interfaces
import { Response } from 'express';
import { IMessage } from '../interfaces/IMessage';
import { IRequest } from '../interfaces/IRequest';
import { Types } from 'mongoose';

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

    message.createdBy = (await User.findById(req.user?._id)
      .select('fullName nickname email createdAt _id')
      .lean()) as any;

    return res.status(200).json(message);
  } catch (error) {
    return res
      .status(422)
      .json({ message: 'Something went wrong while creating the message' });
  }
};

type ListMessagesPostBody = {
  'createdBy._id'?: Types.ObjectId;
  search?: string;
  messageCreatedAt?: any;
  $or?: any[];
};

export const listMessages = async (
  req: IRequest,
  res: Response
): Promise<void | Response> => {
  const createdBy = req.body.createdBy || null;
  const search = req.body.search || null;
  const date = req.body.date || null;

  const filter: ListMessagesPostBody = {};

  if (createdBy != null) {
    filter['createdBy._id'] = Types.ObjectId(createdBy);
  }

  if (date != null) {
    const datePlus1Day = new Date(date);
    datePlus1Day.setDate(datePlus1Day.getDate() + 1);

    filter.messageCreatedAt = {
      $gte: new Date(date),
      $lt: datePlus1Day,
    };
  }

  if (search != null) {
    const searchTerms = search.split(' ');

    filter.$or = searchTerms.map((searchTerm: string) => {
      return {
        $or: [
          { title: { $regex: searchTerm, $options: 'ig' } },
          { message: { $regex: searchTerm, $options: 'ig' } },
          { 'createdBy.fullName': { $regex: searchTerm, $options: 'ig' } },
        ],
      };
    });
  }

  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $addFields: {
          messageCreatedAt: '$createdAt',
        },
      },
      { $unwind: '$createdBy' },
      { $match: filter },
      { $sort: { messageCreatedAt: -1 } },
    ]).exec();

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ message: 'Something went wrong while retrieving the messages' });
  }
};

export const getMostRecentMessages = async (
  req: IRequest,
  res: Response
): Promise<void | Response> => {
  try {
    const messages = await Message.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: '$createdBy' },
      {
        $match: {
          'createdBy._id': {
            $ne: Types.ObjectId(req?.user?._id),
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
    ]).exec();

    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(422)
      .json({ message: 'Something went wrong while retrieving the messages' });
  }
};
