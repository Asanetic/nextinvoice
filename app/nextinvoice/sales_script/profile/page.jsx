import { Suspense } from 'react';

import SalesscriptProfile from '../uiControl/SalesscriptProfile';

import { InteprateSalesscriptEvent } from '../dataControl/SalesscriptRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Sales Script profile"//searchParams?.mosyTitle || "Sales Script";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Sales Script profile`,
    description: 'nextinvoice Sales Script',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function SalesscriptMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SalesscriptProfile 
                    dataIn={{ parentUseEffectKey: "initSalesscriptProfile" }} 
                                           
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