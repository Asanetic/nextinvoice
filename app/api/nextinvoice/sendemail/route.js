// app/api/sendMail/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jereasanya@gmail.com',
      pass: 'uyaa jrms kodc bljw', // Looks like a valid app password 👌
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Jeremiah Asanya" <jereasanya@gmail.com>',
      to: 'clearphrases@gmail.com',
      subject: 'Invoice Ready',
      text: 'Hi! Your invoice is ready.',
      html: `<p>Here’s your invoice. <a href="https://example.com/invoice/123">View it here</a>.</p>`,
    });

    console.log('📨 Email sent:', info.messageId);
    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error('❌ Email send failed:', err);
    return NextResponse.json({ success: false, message: 'Email failed to send.', error: err.message });
  }
}
