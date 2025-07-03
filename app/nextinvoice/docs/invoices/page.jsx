import { Suspense } from 'react';

import InvoicelistList from '../uiControl/InvoicelistList';

import { InteprateInvoicelistEvent } from '../dataControl/InvoicelistRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Invoice list"//searchParams?.mosyTitle || "Invoice list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Invoice list`,
    description: 'nextinvoice Invoice list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function InvoicelistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <InvoicelistList  
                    
                     dataIn={{ parentUseEffectKey: "loadInvoicelistList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateInvoicelistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }