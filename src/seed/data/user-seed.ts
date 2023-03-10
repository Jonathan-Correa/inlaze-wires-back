import User from '../../models/User';
import Group from '../../models/Group';
import { getErrorMessage } from '../../helpers/error-handler';
import chalk from 'chalk';
import { asyncForEach } from '../../helpers/global-helpers';

// Interfaces
import { IUser } from '../../interfaces/IUser';
import { IGroup } from '../../interfaces/IGroup';

const shoudSeed = async (): Promise<boolean> => {
  const count = await User.find().lean().countDocuments();
  return count === 0;
};

export const seed = async (): Promise<void> => {
  const userGroup: IGroup | null = await Group.findOne({ name: 'user' });
  const adminGroup: IGroup | null = await Group.findOne({ name: 'admin' });
  const users: IUser[] = [
    new User({
      firstName: 'User',
      lastName: 'User',
      email: 'user@localhost.com',
      password: '@dsY183nfjd2s@',
      group_id: userGroup?._id,
      username: 'user-user',
      displayName: 'User User',
      roles: ['user'],
    }),
    new User({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@localhost.com',
      password: '@dsY183nvs@',
      group_id: adminGroup?._id,
      username: 'admin-admin',
      displayName: 'Admin Admin',
      roles: ['admin'],
    }),
  ];

  const canSeed = await shoudSeed();
  if (canSeed) {
    console.log('\n-- seeding users');
    try {
      await asyncForEach(users, async (user: IUser) => {
        const password: string | undefined = user.password;
        user.encyptPassword();
        await user.save();
        console.log(
          `user ${user.displayName} seeded -- email: ${user.email}, password: ${password}`
        );
      });
    } catch (e) {
      console.log(chalk.red('Error seeding groups: ' + getErrorMessage(e)));
    }
  } else {
    console.log('Users already exists, not seeding');
  }
};
