    import dbConnect from "@/app/helpers/dbConnect";
    import userModel from "@/models/UserModel";
    import { NextRequest,NextResponse } from "next/server";
    import bcrypt from "bcrypt";



    export  async function POST(request:NextRequest) {
        const {username,email,password}=await request.json();
        console.log(username,email,password)

        await dbConnect();

    try {
        const existingUser= await userModel.findOne({
            email:email
        })
        if(existingUser){
            return NextResponse.json({
                message:"User already exists",
                status:400
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser=await new userModel({
                username,
                email,
                password:hashedPassword
        })
        await newUser.save();
        return NextResponse.json({
                message:"User created successfully",
                status:201,
                newUser
            })
    } catch (error) {
        return NextResponse.json({
            message:"Error creating user",
            status:500,
            error
            })
        
    }



        
    }