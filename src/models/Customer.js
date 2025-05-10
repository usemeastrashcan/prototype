// models/Customer.js
import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "contacted", "engaged", "converted", "lost"],
    default: "new",
  },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
