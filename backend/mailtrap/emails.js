import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail =  async  (email,verificationToken) => {
    const recipients = [{email}];
    try {
        const response = await client.send({
          from: sender,
          to: recipients,
          subject: "Verify your Email",
          html: VERIFICATION_EMAIL_TEMPLATE.replace(
            "{verificationCode}",
            verificationToken
          ),
          category: "Email Verification",
        });
        console.log("Email sent successfully",response)
    } catch (error) {
        throw new Error(`Error sending verification email : ${error}`);
        console.error("Error sending verification email :", error);
    }

}