// Interfaces
import { IUser } from '../interfaces/IUser';
import { Request, Response, NextFunction } from 'express';
import { IError } from '../interfaces/IError';
// modules
import User from '../models/User';
import passport from '../config/strategies/local.strategy';
import { getErrorMessage } from '../helpers/error-handler';

/**
 * Signup
 */
export const signup = async (req: Request, res: Response): Promise<void | Response> => {
  const user: IUser = new User(req.body);

  const dbUser = await User.findOne({
    email: req.body.email,
  }).lean();

  if (dbUser !== null) {
    return res.status(422).json({ message: 'Email Already Taken' });
  }

  user.encyptPassword();
  await user.save();

  // Remove sensitive data before login
  user.password = '';
  user.salt = '';

  const reqUser = user.toObject(); // Convert mongoose.Document to javascript native object before login.

  req.login(reqUser, function (err: IError) {
    if (err) {
      return res.status(422).json({ message: getErrorMessage(err) });
    }

    return res.json(user);
  });
};

export const signin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'local',
    function (err: Error, user: IUser, info: string) {
      if (err || !user) return res.status(422).send(info);

      user.password = '';
      user.salt = '';

      req.login(user, function () {
        return res.status(200).json(user);
      });
    }
  )(req, res, next);
};

export const getUserData = (req: Request, res: Response): Response => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user, status: true });
  }

  return res.status(200).json({ user: null, status: false });
};

/**
 * Logout
 */
export const logout = (req: Request, res: Response): Response => {
  req.logout();
  return res.status(200).json({ message: 'success' });
};
