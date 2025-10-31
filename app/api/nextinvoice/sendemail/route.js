// app/api/sendMail/route.js

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { mosyFlexQuickSel, mosyFlexSelect, mosyQddata } from '../../apiUtils/dataControl/dataUtils';
import { processAuthToken } from '../../auth/authManager';

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let body;
    let isMultipart = false;
    
    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await request.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await request.json();
    }

        const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
         
        if (!isTokenValid) {
          return Response.json(
            { status: 'unauthorized', message: tokenError },
            { status: 403 }
          );
        }

    const {
      txt_message_details: message,
      txt_receiver_email: recipient,
      txt_subject: subject,
    } = body;

    if (!recipient || !subject || !message) {
      return NextResponse.json({ success: false, message: 'Missing email, subject, or message.' }, { status: 400 });
    }

    let emailPass = await mosyFlexQuickSel("account_urls","url", ` where hive_site_id='${authData.hive_site_id}' and url_name='email_password' `,"r")
    let senderMail = await mosyFlexQuickSel("account_urls","url", ` where hive_site_id='${authData.hive_site_id}' and url_name='email_address' `,"r")
    let emailName = await mosyFlexQuickSel("account_urls","url", ` where hive_site_id='${authData.hive_site_id}' and url_name='company_name' `,"r")

    if(!senderMail?.url)
    {
      emailPass ="hzti bulj belm tqdt"
      senderMail ="spectrabill@gmail.com"
      emailName ="Spectra bill";
    }

    const emailAttr = ({email : senderMail?.url, password: emailPass?.url, emailName : emailName?.url})

   if(!emailAttr?.email){
     return NextResponse.json({ success: false, message: 'Email failed to send. Please check your credentials and try again', error: `incorrect credentials` }, { status: 500 });
   }

    // Configure Gmail transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        //user: 'spectrabill@gmail.com',
        //pass: 'hzti bulj belm tqdt', // ✅ Gmail App Password
        user: emailAttr?.email,
        pass: emailAttr?.password, // ✅ Gmail App Password        
      },
    });

    // Send the actual email
    const info = await transporter.sendMail({
      from: `"${emailAttr?.emailName}" <${emailAttr?.email}>`,
      to: recipient,
      subject,
      text: message, // plain text
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`, // basic HTML
    });

    console.log('📨 Email sent:', info.messageId);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email send failed:', err);
    return NextResponse.json({ success: false, message: 'Email failed to send.', error: err.message }, { status: 500 });
  }
}
