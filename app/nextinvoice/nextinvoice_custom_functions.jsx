// add app based functons here /nextinvoiceCustomFunctions 
import { mosyCreatePdf } from '../MosyUtils/mosyCreatePdf'
import { mosyBtoa, mosyGetData, mosyPostFormData } from '../MosyUtils/hiveUtils';
import { MosyAlertCard, MosyConfirm, MosyNotify } from '../MosyUtils/ActionModals';
import { closeMosyCard, MosyCard } from '../components/MosyCard';
import { insertInvoicelist } from './docs/dataControl/InvoicelistRequestHandler';
import SmsremindersProfile from './reminders/uiControl/SmsremindersProfile';


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
              MosyNotify({message : `Error generating receipt... ${response.message}`, addTimer: false, icon:"times-circle" , iconColor: "text-danger"})

              console.log('Error fetching docs data:', response);

              return []; // Safe fallback

            }
          } catch (err) {

            console.log('Error:', err);
            
            MosyNotify({message : `Fatal error generating receipt... ${err}`, addTimer: false, icon:"times-circle" , iconColor: "text-danger"})

            return []; //  Even safer fallback

          }
}


export function convertToInvoice(handleInputChange)
{
  MosyAlertCard({message : "Convert to quotation to invoice?", icon: "copy", iconColor : "text-info",
     onYes: async ()=>{
    
    closeMosyCard("modal2")

    handleInputChange('txt_invoice_type','convert_quotation');

    MosyNotify({message:"Converting to invoice...", icon:"send",addTimer:false, id:"modal1"})
    
    const result = await  insertInvoicelist()

    if (result?.status === 'success') {
      
      const invoicesUptoken = btoa(result.invoices_uptoken || '');
      
      window.location=`./invoiceprofile?invoices_uptoken=${invoicesUptoken}`

    }

  },id:"modal2", onNo:()=>{
    closeMosyCard("modal2")
  },dismissable :false})
}


export function sendMessage(handleInputChange)
{
  MosyAlertCard({message : "I confirm the receiver and the message details are correct", icon: "info-circle", iconColor : "text-info",
     onYes: async ()=>{
    
    MosyNotify({message:"Sending message...", icon:"send",addTimer:false, id:"topmost"})
    

  }, onNo:()=>{
    closeMosyCard()
  }, yesLabel : "Send", noLabel:"Cancel"})
}

export function sendReminder()
{
  MosyCard("", <>
      <SmsremindersProfile
          dataIn={{ parentUseEffectKey: "sendreminderPopUp" , showNavigationIsle : false }}                           
      />
    </>,false, "modal2","mosycard_medium")
}


export function genDocNo() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}${month}${day}`; // e.g. 20250622
}


// utils/copyElementValueToClipboard.js

export async function grabMessage(elementId) {
  try {
    const inputEl = document.getElementById(elementId);

    if (!inputEl) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const text = inputEl.value || inputEl.innerText || inputEl.textContent;

    await navigator.clipboard.writeText(text);
    MosyNotify({message:"Message copied to clipboard.\nYou can paste it any where you prefer"})
    console.log('Copied from element:', text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}


