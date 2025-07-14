import { Suspense } from 'react';

import MydocumentsList from '../uiControl/MydocumentsList';

import { InteprateMydocumentsEvent } from '../dataControl/MydocumentsRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "My documents"//searchParams?.mosyTitle || "My documents";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `My documents`,
    description: 'nextinvoice My documents',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function MydocumentsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <MydocumentsList  
                    
                     dataIn={{ parentUseEffectKey: "loadMydocumentsList" }}
                       
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