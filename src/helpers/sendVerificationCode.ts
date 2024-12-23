import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SendVerifyEmailOptions {
  username: string;
  email: string;
  verifyCode: string;
}

const VerifyEmail = async (
  username: string,
  email: string,
  verifyCode: string
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      console.log("Username: ", process.env.EMAIL_USERNAME);
      console.log("Password: ", process.env.EMAIL_PASSWORD);

      // Create the transporter object with Gmail SMTP server configurations
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Gmail SMTP host
        port: 587, // SMTP port (587 for secure submission)
        secure: false, // Use TLS (not SSL) for connections
        requireTLS: true, // Enforce TLS for secure communication
        auth: {
          user: process.env.EMAIL_USERNAME as string, // Your email address
          pass: process.env.EMAIL_PASSWORD as string, // Your email password or app-specific password
        },
        // logger: true, // Enable logging (useful for debugging)
        // debug: true, // Enable debug mode
      });

      // Define email options
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USERNAME as string, // Sender's email address
        to: email, // Recipient's email address
        subject: "Mystery Feedback. OTP from Email Verification 🔗", // Email subject
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                  <h2 style="text-align: center; color: #4CAF50;">Welcome to Mystery Feedback!</h2>
                  <p>Hi <strong>${username}</strong>,</p>
                  <p>Thank you for registering on Mystery Feedback! Please use the OTP below to verify your email:</p>
                  <div style="text-align: center; margin: 20px 0;">
                      <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; color: #fff; background-color: #4CAF50; border-radius: 5px;">${verifyCode}</span>
                  </div>
                  <p>If you did not request this registration, please ignore this email.</p>
                  <p style="text-align: center; color: #888;">Have a great day!</p>
                  <p style="text-align: center;"> 🦷Mystery Feedback Team🦷</p>
              </div>
          </div>
        `,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, information) => {
        if (error) {
          console.error("Error while sending mail: ", error);
          reject(false); // Reject the promise on error
        } else {
          console.log("Mail has been sent successfully. Info: ", information.response);
          resolve(true); // Resolve the promise on success
        }
      });
    } catch (error) {
      console.error("Unexpected error during sending mail: ", error);
      reject(false); // Reject the promise on unexpected errors
    }
  });
};

const SendVerifyEmail = async (options: SendVerifyEmailOptions): Promise<ApiResponse> => {
    const { username, email, verifyCode } = options;

    try {

        const emailSent = await VerifyEmail(username, email, verifyCode);

        if (emailSent) {
        return {
            success: true,
            message: "Verification email sent successfully",
        };
        } else {
        return {
            success: false,
            message: "Failed to send verification email",
        };
        }
    } catch (emailError) {
        console.log("Error sending verificaiton Eemail: ", emailError);
        return  {
            success: false,
            message: "Failed to send verification email",
        }
    }
};

export { VerifyEmail, SendVerifyEmail };
