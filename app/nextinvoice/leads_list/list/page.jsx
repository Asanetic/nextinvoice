import { Suspense } from 'react';

import LeadslistList from '../uiControl/LeadslistList';

import { InteprateLeadslistEvent } from '../dataControl/LeadslistRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Leads List"//searchParams?.mosyTitle || "Leads List";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Leads List`,
    description: 'nextinvoice Leads List',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function LeadslistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <LeadslistList  
                    
                     dataIn={{ parentUseEffectKey: "loadLeadslistList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateLeadslistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }