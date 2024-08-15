import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/Database/dbConnect";
import UserModel from "@/models/User";
import { User } from "@/models/User";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const { messageId } = params
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                maessage: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if(updatedResult.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    maessage: "Message not found or already deleted"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                maessage: "Deleted"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Not authenticated", error)
        return Response.json(
            {
                success: false,
                maessage: "Not authenticated"
            },
            {
                status: 500
            }
        )
    }
}