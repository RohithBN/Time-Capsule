import dbConnect from "@/app/helpers/dbConnect";
import capsuleModel from "@/models/CapsuleModel";
import userModel from "@/models/UserModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
      const { username } = await request.json();
      if (!username) {
        return NextResponse.json(
          { message: "Username is required", success: false },
          { status: 400 }
        );
      }
  
      // Connect to the database
      await dbConnect();
  
      // Find the user
      const user = await userModel.findOne({ username });
      if (!user) {
        return NextResponse.json(
          { message: "User not found", success: false },
          { status: 404 }
        );
      }
  
      // Fetch capsules associated with the user
      const userCapsules = user.capsules;
      if (!userCapsules || userCapsules.length === 0) {
        return NextResponse.json(
          { message: "No capsules found for this user", success: true, capsules: [] },
          { status: 200 }
        );
      }
  
      // Convert capsule IDs to ObjectId (if necessary)
      const capsuleIds = userCapsules.map((id: mongoose.Types.ObjectId) =>
        mongoose.Types.ObjectId.isValid(id) ? id : new mongoose.Types.ObjectId(id)
      );
  
      // Fetch the capsules
      const capsules = await capsuleModel.find({ _id: { $in: capsuleIds } });
  
      // Convert picture buffer to base64
      const now = new Date();
        const capsulesWithBase64 = capsules.map(capsule => {
        const openOnDate = new Date(capsule.openOn);
  return {
    ...capsule.toObject(),
    isOpen: now >= openOnDate, 
    picture: capsule.picture.toString('base64'), 
   };
});

      
  
      return NextResponse.json(
        { message: "Capsules found", success: true, capsules: capsulesWithBase64 },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error fetching capsules:", error);
      return NextResponse.json(
        { message: "Error fetching capsules", success: false, error: error.message },
        { status: 500 }
      );
    }
  }
  