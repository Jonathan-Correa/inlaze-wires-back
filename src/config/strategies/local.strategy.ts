/**
 * Module dependencies
 */
import { Strategy } from 'passport-local';
import passport from 'passport';
import User from '../../models/User';

passport.use(
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: 'FORM.EMAIL.ERRORS.INCORRECT',
          });
        }

        if (!user.comparePassword(password)) {
          return done(null, false, {
            message: 'FORM.PASSWORD.ERRORS.INCORRECT',
          });
        }

        return done(null, user);
      } catch (e) {
        console.error(e);
        return done(e);
      }
    }
  )
);

export default passport;
