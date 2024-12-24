import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";
const transactionResolvers = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        // Check if the user is authenticated
        if (!context.getUser()) throw new Error("Unauthorized");

        const userId = context.getUser()._id;

        // Fetch transactions for the authenticated user
        const transactions = await Transaction.find({ userId });

        return transactions;
      } catch (error) {
        console.error("Error getting transactions:", error);
        throw new Error("Error getting transactions");
      }
    },

    // Resolver for fetching a single transaction by ID
    transaction: async (_, { transactionId }, context) => {
      try {
        // Check if the user is authenticated
        // console.log("Fetching transaction with ID:", transactionId);

        if (!context.getUser()) throw new Error("Unauthorized");

        // Fetch the transaction by its ID
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
          throw new Error("Invalid transaction ID format");
        }

        // console.log("Transaction ID:", transactionId);

        //const transaction = await Transaction.findById(id).exec();
        const transaction = await Transaction.findById(transactionId)
          .populate("userId")
          .exec();

        if (!transaction) {
          throw new Error("Transaction not found");
        }

        return { ...transaction.toObject(), user: transaction.userId };
      } catch (error) {
        console.error("Error fetching transaction:", error);
        throw new Error("Error fetching transaction");
      }
    },
    //catergory
    categoryStatistics: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");

        const userId = context.getUser()._id;
        const transactions = await Transaction.find({ userId });

        const categoryMap = {};
        transactions.forEach((transaction) => {
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0; // Initialize category total
          }
          categoryMap[transaction.category] += transaction.amount; // Accumulate amount
        });

        return Object.entries(categoryMap).map(([category, totalAmount]) => ({
          category,
          totalAmount,
        })); // Return the aggregated category statistics
      } catch (error) {
        console.error("Error fetching category statistics:", error);
        throw new Error("Failed to fetch category statistics");
      }
    },
    //
  },
  Mutation: {   
    // You can add resolvers for create, update, and delete transactions here
    //CREATE TRANSCATION
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error fetching transaction:", error);
        throw new Error("Error fetching transaction");
      }
    },
    //UPDATE TRANSCATION

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
        return updatedTransaction;
      } catch (error) {
        console.error("Error updating transcation", error);
        throw new Error("Error updating transcation");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );

        return deletedTransaction;
      } catch (error) {
        console.error("Error updating transcation", error);
        throw new Error("Error updating transcation");
      }
    },
  },
  //

  Transaction: {
    user: async (transaction) => {
      try {
        const User = mongoose.model("User");
        const user = await User.findById(transaction.userId).exec();
        return user;
      } catch (error) {
        console.error("Error resolving user:", error);
        return null; // Return null if the user cannot be found
      }
    },
  },

  //
};

export default transactionResolvers;
