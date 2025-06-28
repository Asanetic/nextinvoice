import { Suspense } from 'react';

import SmsremindersProfile from '../uiControl/SmsremindersProfile';

import { InteprateSmsremindersEvent } from '../dataControl/SmsremindersRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Sms Reminders profile"//searchParams?.mosyTitle || "Sms Reminders";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Sms Reminders profile`,
    description: 'nextinvoice Sms Reminders',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function SmsremindersMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <SmsremindersProfile 
                    dataIn={{ parentUseEffectKey: "initSmsremindersProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateSmsremindersEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}