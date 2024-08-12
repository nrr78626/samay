import dbConnect from "@/Database/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendVerificationEmail } from "@/Helpers/senVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { email, username, password } = await request.json()
        const userExistByUsername = await User.findOne({ username, isVerified: true })

        if (userExistByUsername) {
            return Response.json({ success: false, message: "Already exist" }, { status: 400 })
        }

        const existingUserByEmail = await User.findOne({ email })

        if (existingUserByEmail) {
            return Response.json({ success: false, message: "Already exist" }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const salt = await bcrypt.genSalt(10)
        const hassPassword = await bcrypt.hash(password, salt)

        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new User({
            username: username,
            password: hassPassword,
            email: email,
            verifyCode: verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
        })

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        await newUser.save()
        return Response.json({ success: true, message: "Registered" }, { status: 200 })

    } catch (error) {
        console.error("Error registering user", error)
        return Response.json({ success: false, message: "Error registering user" }, { status: 500 })
    }
}