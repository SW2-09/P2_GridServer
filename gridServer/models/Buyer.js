export {Buyer}
import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobs_computed: {
        type: Number,
        default: 0
    }
})

const Buyer = mongoose.model('Buyer', buyerSchema);
