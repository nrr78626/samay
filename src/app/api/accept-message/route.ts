import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/Database/dbConnect";
import { User } from "next-auth";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 401
        })
    }

    const userId: any = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findOneAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Messages acceptance status updated successfully"
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Intarnal Server Error")
        return Response.json({
            success: false,
            message: "falied to update user"
        }, {
            status: 500
        })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 401
        })
    }

    const userId: any = user._id

    try {
        const foundUser = await UserModel.findById({ _id: userId })
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {
                status: 401
            })
        }
    
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },{
            status:200
        })
    } catch (error) {
        console.error("User not found ",error)
        return Response.json({
            success:false,
            message:"user not found"
        },{
            status:500
        })
    }
}