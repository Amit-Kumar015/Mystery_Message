import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const result = verifySchema.safeParse({code})

        if(!result.success){
            const codeError = result.error.format().code?._errors || []
            return Response.json({
                success: false,
                message: codeError.length > 0 ? codeError.join(", ") : "invalid code format"
            }, {status: 400})
        }

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code"
            }, {status: 400})
        }
        else{
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 400})
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {status: 500})
    }
}