import { Suspense } from 'react';

import InvoiceitemsProfile from '../uiControl/InvoiceitemsProfile';

import { InteprateInvoiceitemsEvent } from '../dataControl/InvoiceitemsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice items profile"//searchParams?.mosyTitle || "Invoice items";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice items profile`,
    description: 'nextinvoice Invoice items',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function InvoiceitemsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <InvoiceitemsProfile 
                    dataIn={{ parentUseEffectKey: "initInvoiceitemsProfile" }} 
                                           
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