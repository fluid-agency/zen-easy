import nodemailer from "nodemailer";

//otp sending email
export const sendOtpToUserEmail = async (userEmail: string, otp: string) => {
  if (!userEmail || !otp) {
    throw new Error("email or otp not found!");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Zen Easy BD" <${process.env.GOOGLE_EMAIL}>`,
    to: userEmail,
    subject: "OTP Verification",
    text: `Dear user,

Here is your One-Time Password (OTP): ${otp}.

Please use this code to verify your account. Do not share this code with anyone.

Best Regards,
Zen Easy BD`,

    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #e53e3e;">Your One-Time Password ${otp}</h2>
  </div>
  
  <p>Hello,</p>
  
  <p>Here is your One-Time Password (OTP): <strong style="color: #e53e3e; font-size: 20px;">${otp}</strong></p>
  
  <p>Please use this code to verify your account. Do not share this code with anyone.</p>
  
  <p>Best Regards,<br>Zen Easy BD</p>
</div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to : ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
