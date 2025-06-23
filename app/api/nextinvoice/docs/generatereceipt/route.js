// /app/api/invoice/route.js (Next.js App Router)
import puppeteer from 'puppeteer';
import { processAuthToken } from '../../../auth/authManager';
import { base64Decode, mosyFlexQuickSel, mosyFormartDate, mosyNl2br, mosyQuickSel, mosySumRows, toNum } from '../../../apiUtils/dataControl/dataUtils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);

  if (!isTokenValid) {
    return Response.json({ status: 'unauthorized', message: tokenError }, { status: 403 });
  }

  const cleanKey = searchParams.get("invoice");
  const invoiceDetails = await mosyQuickSel("invoices", `where primkey='${base64Decode(cleanKey)}'`, "r");
  const vendorDetails = await mosyQuickSel("companies", `where company_id='${invoiceDetails?.vendor_name}'`, "r");
  const invoiceSubTotal = await mosySumRows("invoice_items", "rate*quantity", `where invoice_id='${invoiceDetails?.invoice_id}'`);

  const totalAmountPaid = await mosySumRows("invoice_payments", "amount_paid", `where invoice_id='${invoiceDetails?.invoice_id}'`);

  const invoiceItemList = await mosyFlexQuickSel("invoice_items", "rate , quantity, item_name, item_remark, (rate*quantity) as row_totals", `where invoice_id='${invoiceDetails?.invoice_id}'`);

  let discountNode = "";
  if (Number(invoiceDetails?.discount) > 0) {
    discountNode = `<p><b>Discount:</b> ${invoiceDetails?.currency} ${toNum(invoiceDetails?.discount)}</p>`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const logoUrl = `${baseUrl}/api/mediaroom?media=${btoa(vendorDetails?.logo || 'logo.png')}`;
  const badgeUrl = `${baseUrl}/api/mediaroom?media=${btoa('unpaid_badge.jpg')}`;

  
  const grandTotal = Number(invoiceSubTotal) - Number(invoiceDetails?.discount);

  const invoiceBal = Number(totalAmountPaid)-Number(grandTotal)

  const invoiceItemsRows = invoiceItemList.map(item => `
    <tr>
      <td><div style=" font-size:14px;"><b>${item.item_name}</b><br><br>${mosyNl2br(item.item_remark)}</div></td>
      <td>${toNum(item.rate)}</td>
      <td>${toNum(item.quantity)}</td>
      <td>${toNum(item.row_totals)}</td>
    </tr>
  `).join('');

  const invoicePaymentList = await mosyFlexQuickSel("invoice_payments", "date_paid , amount_paid, ref_no, payment_mode,  remark", `where invoice_id='${invoiceDetails?.invoice_id}'`);

  const invoicePaymentRows = invoicePaymentList.map(item => `
    <tr>
      <td><div style=" font-size:14px;"><b>${mosyFormartDate(item.date_paid)}</b></div></td>
      <td>${toNum(item.amount_paid)}</td>
      <td>${(item.ref_no)}</td>
      <td>${(item.payment_mode)}</td>
      <td>${(item.remark)}</td>
    </tr>
  `).join('');


  const htmlContent = `
  <html>
    <head>
      <style>
            html, body {
        font-size: 14px;
      }

        body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
        h1, h3 { margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; vertical-align: top; }
        .totals { margin-top: 30px; font-size: 1.1em; }
        .header-table td { border: none; padding: 0; }
        .header-section { margin-bottom: 20px; }
        hr { margin: 30px 0; border: none; border-top: 1px solid #ccc; }

        .section {
          page-break-inside: avoid;
          margin-bottom: 20px;
        }
        @page {
          margin: 35px 30px; /* top, sides */
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
<section class="section">
      <!-- Header Section -->
      <table class="header-table">
        <tr>
          <td style="width: 30%;">
            <img src="${logoUrl}" width="120" />
          </td>
          <td style="width: 30%;">&nbsp;</td>
          <td style="width: 40%; text-align: right;">
            <div style="line-height:37px">
              ${mosyNl2br(invoiceDetails?.vendor_headers)}
            </div>
          </td>
        </tr>
      </table>

      <hr />

      <!-- Info Section -->
      <table class="header-table">
        <tr>
          <td style="width: 30%;">
            <h3>Bill To</h3>
            <div style="line-height:30px">
            ${mosyNl2br(invoiceDetails?.client_headers)}
            </div>
          </td>
          <td style="width: 30%; text-align: center;">
            <img src="${badgeUrl}" style="opacity: 0.4; width:300px" />
          </td>
          <td style="width: 40%; text-align: right;">
            <h3>RECEIPT</h3>
            <p><b>REF:</b> ${invoiceDetails?.invoice_no}</p>
            <p><b>Date Due:</b> ${invoiceDetails?.date_due}</p>
            <p><b>Subtotal:</b> ${invoiceDetails?.currency} ${toNum(invoiceSubTotal)}</p>
            ${discountNode}
            <p><u><b>Grand Total:</b> ${invoiceDetails?.currency} ${toNum(grandTotal)}</u></p>
            <p><b>Amount paid :</b> ${invoiceDetails?.currency} ${toNum(totalAmountPaid)}</p>
            <p><b>Balance:</b> ${invoiceDetails?.currency} ${toNum(invoiceBal)}</p>
          </td>
        </tr>
      </table>
      <hr>
      <h2><u>Invoice items</u></h2>
      <!-- Item Table -->
      <table>
        <thead style="background-color:#1C73B7; color:#fff">
          <tr><th>Item</th><th>Rate (${invoiceDetails?.currency})</th><th>Qty</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${invoiceItemsRows}
        </tbody>
        <tfoot style="background-color:#1C73B7; color:#FFF">
          <tr><td colspan="3"><b>Total</b></td><td>${toNum(invoiceSubTotal)}</td></tr>
        </tfoot>
      </table>

      <!-- Totals -->
      <div style="text-align:right; width:100%">
        <p><b>Sub Total: ${invoiceDetails?.currency} ${toNum(grandTotal)}</b></p>
        ${discountNode}
        <p><b>Grand Total: ${invoiceDetails?.currency} ${toNum(grandTotal)}</b></p>
      </div>
      <!-- Footer -->
      <div class="">
        ${invoiceDetails?.footnote}
      </div>

      <div class="page-break"></div>
      <hr>
      <h2><u>Invoice Payments</u></h2>
      <!-- Item Table -->
      <table>
        <thead style="background-color:#1C73B7; color:#fff">
          <tr><th>Trx date</th><th>Amt(${invoiceDetails?.currency})</th><th>Ref No</th><th>Mode</th><th>Remark</th></tr>
        </thead>
        <tbody>
          ${invoicePaymentRows}
        </tbody>
        <tfoot style="background-color:#1C73B7; color:#FFF">
          <tr><td><b>Total</b></td><td>${toNum(totalAmountPaid)}</td><td colspan="3"></td></tr>
        </tfoot>
      </table>      
      </section>
    </body>
  </html>
`;


  try {

    const page = await browser.newPage();

    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });


    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      scale: 0.9, // 👈 makes everything smaller (optional)
    });
    
    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=${invoiceDetails?.invoice_no || 'invoice'}.pdf`
      }
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new Response('Failed to generate PDF', { status: 500 });
  }
}
