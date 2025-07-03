// /app/api/htmldoc/route.js
import puppeteer from 'puppeteer';

export async function GET(request) {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #ccc; padding: 8px; }
          </style>
        </head>
        <body>
          <h1>Asanetic Invoice</h1>
          <p>This is a PDF generated with Puppeteer</p>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>
              <tr><td>Fuel</td><td>20L</td><td>Kes 3000</td></tr>
              <tr><td>Service</td><td>1</td><td>Kes 1500</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=asanetic-invoice.pdf',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response('Something went wrong', { status: 500 });
  }
}
