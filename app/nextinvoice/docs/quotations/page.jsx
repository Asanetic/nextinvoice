import { Suspense } from 'react';

import QuotationlistList from '../uiControl/QuotationlistList';

import { InteprateQuotationlistEvent } from '../dataControl/QuotationlistRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Quotation list"//searchParams?.mosyTitle || "Quotation list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Quotation list`,
    description: 'nextinvoice Quotation list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function QuotationlistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <QuotationlistList  
                    
                     dataIn={{ parentUseEffectKey: "loadQuotationlistList" }}
                       
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