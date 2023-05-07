export { Buyer };
import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "buyer",
    },
    jobs_array: {
        type: Array,
        default: [],
    },
});

const Buyer = mongoose.model("Buyer", buyerSchema);
