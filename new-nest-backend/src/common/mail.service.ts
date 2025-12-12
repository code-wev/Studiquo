import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import * as nodemailer from 'nodemailer';

type MailJob = {
  mailOptions: nodemailer.SendMailOptions;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private queue: MailJob[] = [];
  private processing = false;

  async onModuleInit() {
    await this.initTransporter();
    // Run every second to process at most one mail at a time.
    cron.schedule('*/1 * * * * *', () => {
      this.processQueue();
    });
    this.logger.log('MailService initialized and cron started');
  }

  private async initTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: (process.env.SMTP_SECURE || 'false') === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('SMTP transporter configured from environment');
    } else {
      // Fallback to Ethereal for local development
      const account = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: { user: account.user, pass: account.pass },
      });
      this.logger.log(`Ethereal account created: ${account.user}`);
    }
  }

  enqueue(mailOptions: nodemailer.SendMailOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ mailOptions, resolve, reject });
      this.logger.log(`Mail enqueued to ${mailOptions.to}`);
    });
  }

  private async processQueue() {
    if (this.processing) return;
    const job = this.queue.shift();
    if (!job) return;
    this.processing = true;
    try {
      const info = await this.transporter.sendMail(job.mailOptions);
      job.resolve(info);
      this.logger.log(`Mail sent: ${info.messageId}`);
      // If using Ethereal, print preview URL
      try {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) this.logger.log(`Preview URL: ${url}`);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      job.reject(err);
      this.logger.error('Error sending mail', err as any);
    } finally {
      this.processing = false;
    }
  }
}
