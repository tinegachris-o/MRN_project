import mongoose from "mongoose";
const transcationSchema = new mongoose.Schema(
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
    ammount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "uknown",
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Transcation = mongoose.model("Transcation", transcationSchema);
export default Transcation;
