// app/api/sendMail/route.js

import { NextResponse } from 'next/server';
import { mosyFlexQuickSel } from '../../apiUtils/dataControl/dataUtils';
import { processAuthToken } from '../../auth/authManager';

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body = {};
    let isMultipart = contentType.includes("multipart/form-data");

    // 🧩 Parse request body
    if (isMultipart) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    } else {
      body = await request.json();
    }

    // 🔐 Validate token
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
    if (!isTokenValid) {
      return NextResponse.json(
        { success: false, message: tokenError || 'Unauthorized request.' },
        { status: 403 }
      );
    }

    // 📨 Extract message data
    const { txt_message_details: message, txt_receiver_tel: recipient } = body;
    if (!recipient || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing recipient or message.' },
        { status: 400 }
      );
    }

    // 🌐 Fetch SMS API URL from database
    const smsApiRow = await mosyFlexQuickSel(
      "account_urls",
      "url",
      `WHERE hive_site_id='${authData.hive_site_id}' AND url_name='sms_api'`,
      "r"
    );

    const smsApiUrl = smsApiRow?.url;
    if (!smsApiUrl) {
      return NextResponse.json(
        { success: false, message: 'SMS API URL not configured for this account.' },
        { status: 500 }
      );
    }

    // 🧠 Prepare SMS request
    const smsRequest = `pushsms&recp=${encodeURIComponent(recipient)}&body=${encodeURIComponent(message)}`;

    // 🚀 Send SMS
    const response = await fetch(smsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: smsRequest,
    });

    const resultText = await response.text();

    // 🧾 Log response and return success
    console.log('📨 SMS sent successfully:', resultText);
    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully.',
      response: resultText
    });
  } catch (err) {
    console.error('❌ SMS send failed:', err);
    return NextResponse.json(
      { success: false, message: 'SMS failed to send.', error: err.message },
      { status: 500 }
    );
  }
}
