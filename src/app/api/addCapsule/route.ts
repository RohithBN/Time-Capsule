import capsuleModel from "@/models/CapsuleModel";
import dbConnect from "@/app/helpers/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/models/UserModel";

export  async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse form data
    const formData = await request.formData();

    // Get form fields
    const picture = formData.get("picture") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const openOn = formData.get("openOn") as string;
    const username=formData.get('username') as string;
    console.log(title,description,openOn)
    // Validate required fields
    if (!title || !description || !openOn) {
      return NextResponse.json({
        status: 400,
        message: "Title, description, and openOn are required fields.",
      });
    }

    if (!picture) {
      return NextResponse.json({
        status: 400,
        message: "Please select a picture.",
      });
    }

    // Convert the file to a Buffer
    const bytes = await picture.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Buffer:",buffer)

    // Create and save the capsule
    const capsule = new capsuleModel({
      title,
      description,
      openOn: new Date(openOn), // Ensure the date is properly formatted
      picture: buffer,
      createdAt: Date.now(),
    });

    const user= await userModel.findOne({
        username:username
    })

    const savedCapsule=await capsule.save();
    user.capsules.push(savedCapsule._id);
    await user.save();
    

    return NextResponse.json({
      status: 201,
      message: "Capsule created successfully.",
      capsule,
    });
  } catch (error:any) {
    console.error("Error creating capsule:", error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred while creating the capsule.",
      error: error.message,
    });
  }
}
