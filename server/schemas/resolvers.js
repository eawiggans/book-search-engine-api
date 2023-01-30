const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
  user: async (parent, args, context) => {
    if(context.user){
      return User.findOne({ _id: context.user._id }).populate('savedBooks');
    }
    throw new AuthenticationError('You need to be logged in!');
    },
    
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addBook: async (parent, { bookId, authors, description, image, link, title, }, context) => {
      if (context.user) {
        const userNewBook = await User.findByIdAndUpdate({
          _id: context.user._id
        },
        { $addToSet: {savedBooks: bookId, authors, description, image, link, title}},
        { new: true,
        runValidators: true });

        return userNewBook;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const userMinusBook = await User.findOneAndUpdate({
          _id: context.user._id },
          { $pull: {savedBooks: { bookId: bookId }} },
          {new: true,
          runValidators: true}

          );

        return userMinusBook;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  },
};

module.exports = resolvers;
