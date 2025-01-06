import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only if needed for self-signed certificates
  },
  debug: true // Enable for debugging
});

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: "CollegeNotes Support",
        address: process.env.SMTP_USER
      },
      to: email,
      subject: "Password Reset Request",
      html: `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset Request</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    body {
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
    }
    .button {
      display: block;
      width: auto;
      background: #22D172;
      text-decoration: none;
      padding: 10px 0;
      color: #ffffff;
      text-align: center;
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tr>
      <td align="center">
        <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="padding:48px 0 30px 0; text-align: center; font-size: 14px; color: #4C83EE;">
              Notes Mates
            </td>
          </tr>
          <tr>
            <td class="main-content" style="padding: 48px 30px 40px; color: #000000;" bgcolor="#ffffff">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 0 0 24px 0; font-size: 18px; line-height: 150%; font-weight: bold; color: #000000;">
                    Hello! Forgot your password?
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 10px 0; font-size: 14px; line-height: 150%; color: #000000;">
                    We received a password reset request for your account: <span style="color: #4C83EE;">${email}</span>.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 16px 0; font-size: 14px; line-height: 150%; font-weight: 700; color: #000000;">
                    Click the button below to proceed.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <a class="button" href="${resetUrl}" title="Reset Password">Reset Password</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 10px 0; font-size: 14px; line-height: 150%; color: #000000;">
                    The password reset link is only valid for the next 24 hours.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 60px 0; font-size: 14px; line-height: 150%; color: #000000;">
                    If you didn’t request the password reset, please ignore this message or contact our support at <a href="mailto:support_email">support_email</a>.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 16px;">
                    <span style="display: block; width: 117px; border-bottom: 1px solid #8B949F;"></span>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14px; line-height: 170%; color: #000000;">
                    Best regards, <br><strong>Notes Mates</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 0 48px; font-size: 0px;">
              <div class="outlook-group-fix" style="padding: 0 0 20px 0; text-align: center; width:100%;">
                <span style="padding: 0; font-size: 11px; line-height: 15px; color: #8B949F;">Company Legal Name<br/>Company Physical Address</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    await transporter.verify(); // Verify connection configuration
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process reset request" },
      { status: 500 }
    );
  }
}
