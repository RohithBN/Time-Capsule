import mongoose, { Document, Schema } from "mongoose";


export interface CapsuleModel extends Document{
    title:string,
    description:string,
    createdAt:Date,
    OpenOn:Date,
    picture:Buffer
}

const capsuleSchema:Schema<CapsuleModel> = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true
    },
    OpenOn:{
        type:Date,
        required:true
    },
    picture:{
        type:Buffer,
    }
})

const capsuleModel=mongoose.models.Capsule || mongoose.model<CapsuleModel>('Capsule',capsuleSchema);
export default capsuleModel

