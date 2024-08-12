import { z } from "zod";


export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 charecters")
    .max(20, "Username must be no more then 20 charecters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special charecter")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password mus be at least 6 charecters" })
})