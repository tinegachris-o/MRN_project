import Transcation from "../models/transcationModel.js";

const transcationResolvers = {
  Query: {
    transcations: async (_, context) => {
      try {
        // Check if the user is authenticated
        if (!context.getUser()) throw new Error("Unauthorized");

        const userId = context.getUser()._id;

        // Fetch transactions for the authenticated user
        const transactions = await Transcation.find({ userId });
        return transactions;
      } catch (error) {
        console.error("Error getting transactions:", error);
        throw new Error("Error getting transactions");
      }
    },

    // Resolver for fetching a single transaction by ID
    transcation: async (_, { transactionId }, context) => {
      try {
        // Check if the user is authenticated
        if (!context.getUser()) throw new Error("Unauthorized");

        // Fetch the transaction by its ID
        const transaction = await Transcation.findById(transactionId);

        if (!transaction) {
          throw new Error("Transaction not found");
        }

        return transaction;
      } catch (error) {
        console.error("Error fetching transaction:", error);
        throw new Error("Error fetching transaction");
      }
    },
  },

  Mutation: {
    // You can add resolvers for create, update, and delete transactions here
    //CREATE TRANSCATION
    createTranscation: async (_, { input }, context) => {
      try {
        const newTranscation = new Transcation({
          ...input,
          userId: context.getUser()._id,
        });
        await newTranscation.save();
        return newTranscation;
      } catch (error) {
        console.error("Error fetching transaction:", error);
        throw new Error("Error fetching transaction");
      }
    },
    //UPDATE TRANSCATION

    updateTranscation: async (_, { input }) => {
      try {
        const updatedTranscation = await Transcation.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
        return updatedTranscation;
      } catch (error) {
        console.error("Error updating transcation", error);
        throw new Error("Error updating transcation");
      }
    },
    deleteTranscation: async (_, { transactionId }) => {
      try {
        const deletedTranscation = await Transcation.findByIdAndDelete(
          transactionId
        );

        return deletedTranscation;
      } catch (error) {
        console.error("Error updating transcation", error);
        throw new Error("Error updating transcation");
      }
    },
  },
};

export default transcationResolvers;
