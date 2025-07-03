import { Suspense } from 'react';

import QuotationlistProfile from '../uiControl/QuotationlistProfile';

import { InteprateQuotationlistEvent } from '../dataControl/QuotationlistRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Quotation list profile"//searchParams?.mosyTitle || "Quotation list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Quotation list profile`,
    description: 'nextinvoice Quotation list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function QuotationlistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <QuotationlistProfile 
                    dataIn={{ parentUseEffectKey: "initQuotationlistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateQuotationlistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}