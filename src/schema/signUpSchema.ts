import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, {message: "username must be atleast 2 characters"})
    .max(24, {message: "username must be atmost 24 characters"})
    .regex(/^[a-zA-Z0-9_]+$/, {message: "username should not contain special characters"})

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
})