/**
 * Module dependencies
 */
import { Types } from 'mongoose';
import passport from 'passport';
import { Express } from 'express';
import User from '../models/User';

interface IUser extends Express.User {
  _id?: string;
}

/**
 * Module init function
 */
// Serialize sessions
passport.serializeUser(function (user: IUser, done): void {
  done(null, user._id);
});

// Deserialize sessions
passport.deserializeUser(async function (id: Types.ObjectId, done) {
  const user = await User.findOne(
    {
      _id: id,
    },
    '-password -salt'
  ).lean();

  done(null, user);
});

// Add passport's middleware
import './strategies/local.strategy';

export default passport;
