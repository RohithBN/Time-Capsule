import mongoose, { Document, Schema } from "mongoose";


export interface CapsuleModel extends Document{
    _id:mongoose.Types.ObjectId
    title:string,
    description:string,
    createdAt:Date,
    openOn:Date,
    picture:Buffer
    isOpen:boolean
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
    openOn:{
        type:Date,
        required:true
    },
    picture:{
        type:Buffer,
    },
    isOpen:{
        type:Boolean,
        default:false
    }
})

const capsuleModel=mongoose.models.Capsule || mongoose.model<CapsuleModel>('Capsule',capsuleSchema);
export default capsuleModel

