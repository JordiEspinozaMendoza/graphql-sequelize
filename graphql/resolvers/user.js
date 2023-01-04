// graphql/resolvers/user.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthenticationError } = require("apollo-server-express");

const { User } = require("../../database/models");

module.exports = {
  Mutation: {
    async register(root, args, context) {
      try {
        const { name, email, password } = args.input;
        return User.create({ name, email, password });
      } catch (error) {
        throw new AuthenticationError("Invalid credentials");
      }
    },
    async login(root, { input }, context) {
      const { email, password } = input;
      const user = await User.findOne({ where: { email } });
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, "mySecretKey");
        return { ...user.toJSON(), token };
      }
      throw new AuthenticationError("Invalid credentials");
    },
  },
};
