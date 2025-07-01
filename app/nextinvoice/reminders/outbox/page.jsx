import { Suspense } from 'react';

import MessageoutboxProfile from '../uiControl/MessageoutboxProfile';

import { InteprateMessageoutboxEvent } from '../dataControl/MessageoutboxRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Message OutBox profile"//searchParams?.mosyTitle || "Message OutBox";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Message OutBox profile`,
    description: 'nextinvoice Message OutBox',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function MessageoutboxMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <MessageoutboxProfile 
                    dataIn={{ parentUseEffectKey: "initMessageoutboxProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateMessageoutboxEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}