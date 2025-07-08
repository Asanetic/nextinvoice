import { Suspense } from 'react';

import InvoiceitemsList from '../uiControl/InvoiceitemsList';

import { InteprateInvoiceitemsEvent } from '../dataControl/InvoiceitemsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice items"//searchParams?.mosyTitle || "Invoice items";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice items`,
    description: 'nextinvoice Invoice items',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function InvoiceitemsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <InvoiceitemsList  
                    
                     dataIn={{ parentUseEffectKey: "loadInvoiceitemsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateInvoiceitemsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }