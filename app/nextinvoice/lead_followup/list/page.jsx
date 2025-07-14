import { Suspense } from 'react';

import LeadfollowupList from '../uiControl/LeadfollowupList';

import { InteprateLeadfollowupEvent } from '../dataControl/LeadfollowupRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Lead Followup"//searchParams?.mosyTitle || "Lead Followup";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Lead Followup`,
    description: 'nextinvoice Lead Followup',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function LeadfollowupMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <LeadfollowupList  
                    
                     dataIn={{ parentUseEffectKey: "loadLeadfollowupList" }}
                       
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