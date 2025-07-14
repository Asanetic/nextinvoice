import { Suspense } from 'react';

import MydocumentsProfile from '../uiControl/MydocumentsProfile';

import { InteprateMydocumentsEvent } from '../dataControl/MydocumentsRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "My documents profile"//searchParams?.mosyTitle || "My documents";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `My documents profile`,
    description: 'nextinvoice My documents',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function MydocumentsMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <MydocumentsProfile 
                    dataIn={{ parentUseEffectKey: "initMydocumentsProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateMydocumentsEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}