import { Suspense } from 'react';

import BusinesslistProfile from '../uiControl/BusinesslistProfile';

import { InteprateBusinesslistEvent } from '../dataControl/BusinesslistRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Business list profile"//searchParams?.mosyTitle || "Business list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Business list profile`,
    description: 'nextinvoice Business list',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function BusinesslistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <BusinesslistProfile 
                    dataIn={{ parentUseEffectKey: "initBusinesslistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateBusinesslistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}