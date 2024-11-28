import mongoose, { Document, Schema, Types } from "mongoose";

// CapsuleModel is imported to reference its schema
import { CapsuleModel } from "./CapsuleModel";

export interface User extends Document {
    username: string;    
    email: string;
    password: string;
    capsules: Types.ObjectId[]; // Referenced CapsuleModel IDs
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: true,
    },
    capsules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Capsule", // References CapsuleModel
        },
    ],
});

const userModel = mongoose.models.User || mongoose.model<User>("User", userSchema);
export default userModel;
