import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configPassport = async () => {
  passport.serializeUser((user, done) => {
    //console.log("serializer user");

    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    //console.log("Deserializer user");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username});
        if (!user) {
          throw new Error("Invalid username and password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid username or password");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
