import { Suspense } from 'react';

import ClientlistProfile from '../uiControl/ClientlistProfile';

import { InteprateClientlistEvent } from '../dataControl/ClientlistRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Client List profile"//searchParams?.mosyTitle || "Client List";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Client List profile`,
    description: 'nextinvoice Client List',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function ClientlistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ClientlistProfile 
                    dataIn={{ parentUseEffectKey: "initClientlistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateClientlistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}