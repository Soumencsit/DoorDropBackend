import mongoose from "mongoose";

const { Schema } = mongoose;

const UserOTPVerificationSchema = new Schema({
    email: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const userOTPVerification =mongoose.model.userOTPVerification|| mongoose.model("userOTPVerification", UserOTPVerificationSchema);

export default userOTPVerification;

