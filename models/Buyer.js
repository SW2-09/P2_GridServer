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
    jobs_array: {
        type: Array,
        default: [],
    },
});

const Buyer = mongoose.model("Buyer", buyerSchema);
