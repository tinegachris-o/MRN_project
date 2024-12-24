import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: { type: String, required: true },
    //
    paymentType: { type: String, enum: ["cash", "card"], required: true },
    category: {
      type: String,
      enum: ["saving", "expense", "investment"],
    },
    amount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "uknown",
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
