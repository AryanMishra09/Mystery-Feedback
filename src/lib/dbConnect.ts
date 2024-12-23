import mongoose from "mongoose";

type ConnectionObject = {
    isConected?: number 
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    //saftey check as Nextjs runs on edge, means it doesn't run everytime, it runs when there is request, so if DB is already connected and then there is a request then to avoid choke condition(extra connection everytime) I added this logic:
    if(connection.isConected) {
        console.log("Already connected to DB");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConected = db.connections[0].readyState;
        // console.log("DB: ", db);
        // console.log("db.connections: ", db.connections);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed", error);
        process.exit(1)
    }
};

export default dbConnect;