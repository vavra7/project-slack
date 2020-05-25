import _ from 'lodash';
import { tryLogin } from '../auth';

const formatErrors = (e, models) => {
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (parent, args, { models }) => {
      try {
        // if (password.length < 4 || password.length > 100) {
        //   return {
        //     ok: false,
        //     errors: [
        //       {
        //         path: 'password',
        //         message: 'The password needs to be between 5 and 100 characters long'
        //       }
        //     ]
        //   };
        // }

        // const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({ ...args });

        return {
          ok: true,
          user,
          errors: null
        };
      } catch (err) {
        return {
          ok: false,
          user: null,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
