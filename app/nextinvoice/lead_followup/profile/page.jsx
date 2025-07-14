import { Suspense } from 'react';

import LeadfollowupProfile from '../uiControl/LeadfollowupProfile';

import { InteprateLeadfollowupEvent } from '../dataControl/LeadfollowupRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Lead Followup profile"//searchParams?.mosyTitle || "Lead Followup";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Lead Followup profile`,
    description: 'nextinvoice Lead Followup',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function LeadfollowupMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <LeadfollowupProfile 
                    dataIn={{ parentUseEffectKey: "initLeadfollowupProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateLeadfollowupEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}