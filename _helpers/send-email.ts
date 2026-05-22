import 'dotenv/config';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || config.emailFrom }: any) {
    // Check for the Resend key directly on the cloud server
    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // CAPTURE the error object returned by Resend
        const { error } = await resend.emails.send({ from, to, subject, html });
        
        if (error) {
            // This forces Render's terminal logs to show you exactly why Resend rejected it
            throw new Error(`Resend API rejection: ${error.message}`);
        }
        return;
    }

    // Fallback to SMTP (for local/dev) 
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}