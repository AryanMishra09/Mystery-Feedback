import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
 
const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request){
    if(request.method !== 'GET'){
        return Response.json({
            success: false,
            message: "Method not allowed",
        }, {status: 405});
    }
    await dbConnect();

    try {
        //URL:- localhost:3000/api/unique-username?username=aryan?phone=android
        const {searchParams} = new URL(request.url)  //it will give you the request URL
        const queryParam = {
            username: searchParams.get("username")
        }
        //validate with zod:
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("Result: ", result );   //TODO: comment out
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 
                    ? usernameErrors.join(", ")
                    : "Invalid query parameters"
            }, {status: 400})
        }
        const {username} = result.data;
        console.log("username: ", username);
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});
        console.log("existingVerifiedUser: ", existingVerifiedUser);
        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }
        return Response.json({
            success: true,
            message: "Username is available"
        }, {status: 201})

    } catch (error) {
        console.log("Error checking username uniqueness: ", error);
        return Response.json({
            success: false,
            message: "Error checking uniqueness of username"
        }, {status: 500});
    }
}