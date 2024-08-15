import UserModel from "@/models/User";
import dbConnect from "@/Database/dbConnect";
import { Message } from "@/models/User";

export async function POST(request: Request) {
    dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
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

        // is user accepting the message
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "Not accepting messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message send successfully"
            },
            {
                status: 404
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