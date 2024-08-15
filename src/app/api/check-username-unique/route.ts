import UserModel from "@/models/User";
import dbConnect from "@/Database/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";


const UserNameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UserNameQuerySchema.safeParse(queryParams)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
            }, { status: 400 })
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Available"
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}