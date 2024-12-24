import { transactions, users } from "../dummyData/data.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js"
import bcrypt from "bcryptjs";
const usersResolvers = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All Fields are required");
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("user already exist");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {
        console.error("Error in creatUser:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        await context.login(user);
        return user;
      } catch (error) {
        console.log("Error in login:", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    //logout
    logout: async (parent, _, context) => {
      try {
        const { req, res } = context; // Extract req and res from context

        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");
        return { message: "Logged out sucessffully" };
      } catch (error) {}
    },
  },
  Query: {
    authUser: async (parent, _, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.log("Error in auth:", error);
        throw new Error("internal server Error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.log("Error in user query:", error);
        throw new Error(error.message || "internal server Error");
      }
    },
  },
  //TODO ADD USER TRANSCATION RELATIONSHIP


  User:{
    transactions:async(parent)=>{
try {
  const transactions= await Transaction.find({userId:parent._id})
  return transactions
} catch (error) {
  console.log("error in transaction error resolver",error)
        throw new Error(error.message || "internal server Error");

}
    }
  }
};
export default usersResolvers;
