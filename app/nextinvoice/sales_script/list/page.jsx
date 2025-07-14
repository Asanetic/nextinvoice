import { Suspense } from 'react';

import SalesscriptList from '../uiControl/SalesscriptList';

import { InteprateSalesscriptEvent } from '../dataControl/SalesscriptRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Sales Script"//searchParams?.mosyTitle || "Sales Script";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Sales Script`,
    description: 'nextinvoice Sales Script',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function SalesscriptMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SalesscriptList  
                    
                     dataIn={{ parentUseEffectKey: "loadSalesscriptList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSalesscriptEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }