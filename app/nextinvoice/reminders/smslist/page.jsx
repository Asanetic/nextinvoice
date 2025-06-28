import { Suspense } from 'react';

import SmsremindersList from '../uiControl/SmsremindersList';

import { InteprateSmsremindersEvent } from '../dataControl/SmsremindersRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Sms Reminders"//searchParams?.mosyTitle || "Sms Reminders";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Sms Reminders`,
    description: 'nextinvoice Sms Reminders',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function SmsremindersMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SmsremindersList  
                    
                     dataIn={{ parentUseEffectKey: "loadSmsremindersList" }}
                       
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