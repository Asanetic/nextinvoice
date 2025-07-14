// /app/api/invoice/route.js (Next.js App Router)
import puppeteer from 'puppeteer';
import { processAuthToken } from '../../../auth/authManager';
import { base64Decode, mosyFlexQuickSel, mosyNl2br, mosyQuickSel, mosySumRows, toNum } from '../../../apiUtils/dataControl/dataUtils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);

  // if (!isTokenValid) {
  //   return Response.json({ status: 'unauthorized', message: tokenError }, { status: 403 });
  // }

  const cleanKey = searchParams.get("doc");
  const noteDetails = await mosyQuickSel("quick_notes", `where primkey='${base64Decode(cleanKey)}'`, "r");



  const htmlContent = `
  <html>
    <head>
      <style>
           
      html, body {
        font-size: 16px;
      }

        body { font-family: Arial, sans-serif; color: #000; }      
        table { width: 100%;}
        .doc_page{
         line-height:30px;
        }
        hr { margin: 1px; }

        .section {
          page-break-inside: avoid;
          margin-bottom: 20px;
        }
        @page {
          margin: 5px 30px; /* top, sides */
        }

      </style>
    </head>
    <body>
     <section class="section">
    
      
      <div class="doc_page">
        ${noteDetails?.note_details || ""}
      </div>


      </section>
    </body>
  </html>
`;


  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
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
        'Content-Disposition': `inline; filename=${noteDetails?.note_title || 'note'}.pdf`
      }
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new Response('Failed to generate PDF', { status: 500, message:err });
  }
}
