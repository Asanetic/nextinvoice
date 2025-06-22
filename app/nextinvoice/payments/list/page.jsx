import { Suspense } from 'react';

import InvoicepaymentsList from '../uiControl/InvoicepaymentsList';

import { InteprateInvoicepaymentsEvent } from '../dataControl/InvoicepaymentsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice payments"//searchParams?.mosyTitle || "Invoice payments";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice payments`,
    description: 'nextinvoice Invoice payments',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function InvoicepaymentsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <InvoicepaymentsList  
                    
                     dataIn={{ parentUseEffectKey: "loadInvoicepaymentsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateInvoicepaymentsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }