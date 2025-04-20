import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { apiResponse } from "../types/apiResponse";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<apiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message verification code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        console.log("verification code send successfully");

        return {success: true, message: "Verification email sent successfully"}
    } catch (emailError) {
        console.log("error sending verification code");

        return {success: false, message: "Failed to send verification email."}
    }
}

