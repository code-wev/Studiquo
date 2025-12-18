import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
        ...options,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error('Email sending failed', error);
      throw error;
    }
  }

  // ======================
  // Reusable email helpers
  // ======================

  async sendResetPasswordEmail(email: string, resetLink: string) {
    return this.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="380" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;">
              <h2 style="margin:0;font-size:22px;font-weight:600;color:#111;">
                Forgot Password?
              </h2>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <div style="width:64px;height:64px;background:#d9c8ff;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                  width="28"
                  height="28"
                  alt="Email"
                  style="display:block;"
                />
              </div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 28px 16px;text-align:center;">
              <p style="font-size:16px;font-weight:600;color:#000;margin:0 0 8px;">
                Reset Link Sent!
              </p>

              <p style="font-size:14px;color:#555;line-height:1.6;margin:0;">
                A password reset link has been sent to
                <strong style="color:#000;">${email}</strong>.
                Please click the button below to reset your password.
                This link will be valid for <strong>5 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:24px 28px;">
              <a
                href="${resetLink}"
                target="_blank"
                style="
                  display:inline-block;
                  width:100%;
                  text-align:center;
                  padding:12px 0;
                  background:#cbb8ff;
                  color:#3b2aa5;
                  text-decoration:none;
                  border-radius:10px;
                  font-size:15px;
                  font-weight:600;
                "
              >
                Reset Password
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <div style="height:1px;background:#e0e0e0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px 32px;text-align:center;">
              <p style="font-size:13px;color:#555;margin:0 0 6px;">
                If you didn’t request this, you can safely ignore this email.
              </p>

              <p style="font-size:13px;color:#888;margin:0;">
                Need help? Contact
                <a href="mailto:support@yourapp.com" style="color:#5b3fd6;text-decoration:none;">
                  support@yourapp.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.sendMail({
      to: email,
      subject: 'Welcome to Our Service!',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="380" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;">
              <h2 style="margin:0;font-size:22px;font-weight:600;color:#111;">
                Welcome, ${name}! 🎉
              </h2>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <div style="width:64px;height:64px;background:#d9c8ff;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                  width="28"
                  height="28"
                  alt="Welcome"
                  style="display:block;"
                />
              </div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 28px 16px;text-align:center;">
              <p style="font-size:16px;font-weight:600;color:#000;margin:0 0 8px;">
                We're excited to have you on board!
              </p>

              <p style="font-size:14px;color:#555;line-height:1.6;margin:0;">
                Hi <strong style="color:#000;">${name}</strong>,<br/>
                Welcome to our service. You’re all set to explore features,
                connect with others, and get started right away.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:24px 28px;">
              <a
                href="https://yourapp.com/dashboard"
                target="_blank"
                style="
                  display:inline-block;
                  width:100%;
                  text-align:center;
                  padding:12px 0;
                  background:#cbb8ff;
                  color:#3b2aa5;
                  text-decoration:none;
                  border-radius:10px;
                  font-size:15px;
                  font-weight:600;
                "
              >
                Get Started
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <div style="height:1px;background:#e0e0e0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px 32px;text-align:center;">
              <p style="font-size:13px;color:#555;margin:0 0 6px;">
                If you have any questions, we’re always here to help.
              </p>

              <p style="font-size:13px;color:#888;margin:0;">
                Contact us at
                <a href="mailto:support@yourapp.com" style="color:#5b3fd6;text-decoration:none;">
                  support@yourapp.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
  }

  async sendPaymentConfirmationEmail(email: string, amount: number) {
    return this.sendMail({
      to: email,
      subject: 'Payment Confirmation',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payment Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="380" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.1);font-family:Arial,sans-serif;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;">
              <h2 style="margin:0;font-size:22px;font-weight:600;color:#111;">
                Payment Successful! 💳
              </h2>
            </td>
          </tr>
          <!-- Icon -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <div style="width:64px;height:64px;background:#d9c8ff;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                  width="28"
                  height="28"
                  alt="Payment"
                  style="display:block;"
                />
              </div>
            </td>
          </tr>
          <!-- Message -->
          <tr>
            <td style="padding:0 28px 16px;text-align:center;">
              <p style="font-size:16px;font-weight:600;color:#000;margin:0 0 8px;">
                Thank you for your payment!
              </p>
              <p style="font-size:14px;color:#555;line-height:1.6;margin:0;">
                We have received your payment of
                <strong style="color:#000;">$${amount.toFixed(2)}</strong>.
                Your transaction was successful, and your account has been updated accordingly.
              </p>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <div style="height:1px;background:#e0e0e0;"></div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px 32px;text-align:center;">
              <p style="font-size:13px;color:#555;margin:0 0 6px;">
                If you have any questions about your payment, feel free to reach out to us.
              </p>
              <p style="font-size:13px;color:#888;margin:0;">
                Contact support at
                <a href="mailto:support@yourapp.com" style="color:#5b3fd6;text-decoration:none;">
                  support@yourapp.com
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    });
  }
}
