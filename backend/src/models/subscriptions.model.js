import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // the user who subscribes the channel(A chanel is also a user)
        ref: 'User'
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);

