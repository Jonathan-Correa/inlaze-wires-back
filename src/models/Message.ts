import { Schema, model, Types } from 'mongoose';
import { IMessage } from '../interfaces/IMessage';

const messageSchema: Schema<IMessage> = new Schema(
  {
    title: {
      type: String,
      required: 'Please fill the title of the message',
    },
    message: {
      type: String,
      required: 'Please fill the message',
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IMessage>('Message', messageSchema);
