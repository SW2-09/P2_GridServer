export {Worker}
import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
    workerId: {
        type: String,
        required: true
    },
    jobs_computed: {
        type: Number,
        default: 0
    }
})

const Worker = mongoose.model('Worker', buyerSchema);
