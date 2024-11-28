import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        return console.log('Database is already connected');
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected');      
    } catch (error) {
        console.error(error);
        console.log("Database connection failed")
        process.exit()
        
    }
}

export default dbConnect;