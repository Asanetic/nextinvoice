'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function InvoicePrintPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('q');

  useEffect(() => {
    if (!invoiceId) return;
  
    const fetchAndDownload = async () => {
      try {
        const encodedId = btoa(invoiceId);
        const url = `/api/nextinvoice/docs/generatereceipt?invoice=${encodedId}`;
        const response = await fetch(url);
  
        if (!response.ok) throw new Error('Failed to generate');
  
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        window.location.href = objectUrl;
  
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          if (window.opener) window.close();
        }, 3000);
  
      } catch (err) {
        alert("Something went wrong generating the invoice.");
        console.error(err);
      }
    };
  
    fetchAndDownload();
  }, [invoiceId]);
  

  return (
    <div className="invoice-loader">
      <h1>Generating your invoice…</h1>
      <p>Please wait while we prepare your receipt. This window will close automatically.</p>
    </div>
  );
}
