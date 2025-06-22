import { Suspense } from 'react';

import InvoicepaymentsProfile from '../uiControl/InvoicepaymentsProfile';

import { InteprateInvoicepaymentsEvent } from '../dataControl/InvoicepaymentsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice payments profile"//searchParams?.mosyTitle || "Invoice payments";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice payments profile`,
    description: 'nextinvoice Invoice payments',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function InvoicepaymentsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <InvoicepaymentsProfile 
                    dataIn={{ parentUseEffectKey: "initInvoicepaymentsProfile" }} 
                                           
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