// add app based functons here /nextinvoiceCustomFunctions 
import { mosyCreatePdf } from '../MosyUtils/mosyCreatePdf'
import { mosyBtoa, mosyGetData } from '../MosyUtils/hiveUtils';
import { MosyNotify } from '../MosyUtils/ActionModals';
import { closeMosyCard } from '../components/MosyCard';


export function loadVendorHeaders(dataRes)
{
  const vendorHeaders = `${dataRes?.business_name}
${dataRes?.mobile}
${dataRes?.email}
${dataRes?.location}`

  return vendorHeaders

}


export function loadClientHeaders(dataRes)
{
  const clientHeaders = `${dataRes?.client_name}
${dataRes?.client_tel}
${dataRes?.client_email}
${dataRes?.client_location}`

  return clientHeaders

}

export async function downloadInvoiceOld({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating invoice...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generateinvoice',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
            });
        
            if (response.status === 'success') {
              //console.log('docs Data:', response.data);
              mosyCreatePdf(response.data);
              closeMosyCard()
              // ✅ Return the data
            } else {
              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            return []; //  Even safer fallback
          }
}

export async function downloadInvoice({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating invoice...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generateinvoice',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
                rawResponse : true
            });
        
            if (response.ok) {
              //console.log('docs Data:', response.data);
              //mosyCreatePdf(response.data);

              if (!response.ok) {
                console.error('Failed to generate PDF:', response.statusText);
                return;
              }
          
              const blob = await response.blob();
          
              const fileName = `${invoiceId}.pdf`;
              const url = URL.createObjectURL(blob);
          
              // 1. Preview in a new tab
              window.open(url, '_blank');
              
              // 2. Auto-download
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 3. Safe cleanup after delay (important!)
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 20000); // 20 seconds to be sure the new tab loaded fully
                    
                                      
              closeMosyCard()
              // ✅ Return the data
            } else {
              MosyNotify({message : `Error generating invoice... ${response}`, addTimer: false, icon:"time-circle" , iconColor: "text-danger"})

              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            MosyNotify({message : `Error generating invoice... ${err}`, addTimer: false, icon:"time-circle" , iconColor: "text-danger"})

            return []; //  Even safer fallback
          }
}


export async function downloadQuotation({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating quotation...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generatequotation',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
                rawResponse : true
            });
        
            if (response.ok) {
              //console.log('docs Data:', response.data);
              //mosyCreatePdf(response.data);

              if (!response.ok) {
                console.error('Failed to generate PDF:', response.statusText);
                return;
              }
          
              const blob = await response.blob();
          
              const fileName = `${invoiceId}.pdf`;
              const url = URL.createObjectURL(blob);
          
              // 1. Preview in a new tab
              window.open(url, '_blank');
              
              // 2. Auto-download
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 3. Safe cleanup after delay (important!)
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 20000); // 20 seconds to be sure the new tab loaded fully
                    
                                      
              closeMosyCard()
              // ✅ Return the data
            } else {
              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            return []; //  Even safer fallback
          }
}

export async function downloadReceipt({invoiceId="test"})
{
          try {
            MosyNotify({message : "Generating receipt...", addTimer: false, icon:"copy"})
            const response = await mosyGetData({
              endpoint: '/api/nextinvoice/docs/generatereceipt',
              params: { 
                invoice: mosyBtoa(invoiceId), 
                },
                rawResponse : true
            });
        
            if (response.ok) {
              //console.log('docs Data:', response.data);
              //mosyCreatePdf(response.data);

              if (!response.ok) {
                console.error('Failed to generate PDF:', response.statusText);
                return;
              }
          
              const blob = await response.blob();
          
              const fileName = `${invoiceId}.pdf`;
              const url = URL.createObjectURL(blob);
     
              // 1. Preview in a new tab
              window.open(url, '_blank');
              
              // 2. Auto-download
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // 3. Safe cleanup after delay (important!)
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 20000); // 20 seconds to be sure the new tab loaded fully
                                      
              closeMosyCard()
              // ✅ Return the data
            } else {
              MosyNotify({message : `Error generating invoice... ${response}`, addTimer: false, icon:"times-circle" , iconColor: "text-danger"})

              console.log('Error fetching docs data:', response);
              return []; // Safe fallback
            }
          } catch (err) {
            console.log('Error:', err);
            MosyNotify({message : `Error generating invoice... ${err}`, addTimer: false, icon:"time-circle" , iconColor: "text-danger"})

            return []; //  Even safer fallback
          }
}


export function genDocNo() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}${month}${day}`; // e.g. 20250622
}
