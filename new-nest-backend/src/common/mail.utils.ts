import * as nodemailer from 'nodemailer';

export type MailParams = nodemailer.SendMailOptions;

/** Build a SendMailOptions object with sensible defaults */
export function buildMailOptions(opts: Partial<MailParams>): MailParams {
  const from = opts.from || process.env.MAIL_FROM || 'no-reply@example.com';
  const to = opts.to || '';
  const subject = opts.subject || 'Notification from App';
  const text = opts.text || stripHtml(opts.html || '');
  const html = opts.html || `<p>${text}</p>`;

  return { from, to, subject, text, html } as MailParams;
}

/** Very small template renderer for a few common mail types */
export function renderTemplate(
  name: string,
  data: Record<string, any> = {},
): string {
  switch (name) {
    case 'resetPassword': {
      const link = data.link || '#';
      const appName = process.env.APP_NAME || 'Our App';
      return `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4;">
          <h2 style="color:#333">${appName} — Password reset</h2>
          <p>If you requested a password reset, click the link below to set a new password.</p>
          <p><a href="${escapeHtml(link)}">Reset password</a></p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `;
    }

    case 'notification': {
      const title = data.title || 'Notification';
      const message = data.message || '';
      return `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4;">
          <h3 style="color:#333">${escapeHtml(title)}</h3>
          <p>${escapeHtml(message)}</p>
        </div>
      `;
    }

    default:
      return data.html || escapeHtml(String(data.text || ''));
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(html = ''): string {
  return html.replace(/<[^>]*>/g, '');
}

/** Convenience generator for a reset-password mail options */
export function generateResetPasswordMail(
  to: string,
  link: string,
  opts?: { subject?: string; from?: string },
): MailParams {
  const html = renderTemplate('resetPassword', { link });
  return buildMailOptions({
    to,
    from: opts?.from,
    subject: opts?.subject || 'Reset your password',
    html,
    text: `Reset your password: ${link}`,
  });
}
