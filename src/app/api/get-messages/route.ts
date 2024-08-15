import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/Database/dbConnect";
import { User } from "next-auth";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
    dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate(
            [
                { $match: { id: userId } },
                { $unwind: '$messages' },
                { $sort: { 'messages.createdAt': -1 } },
                { $group: { _id: '$_id', messages: { $push: '$messages' } } }
            ]
        )

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages
            }
        )
    } catch (error) {
        console.error("An unexpected error occured : ", error)
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 500
            }
        )
    }
}