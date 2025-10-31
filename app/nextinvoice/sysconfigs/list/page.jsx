import { Suspense } from 'react';

import SystemsettingsList from '../uiControl/SystemsettingsList';

import { InteprateSystemsettingsEvent } from '../dataControl/SystemsettingsRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "System settings "//searchParams?.mosyTitle || "System settings";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `System settings`,
    description: 'nextinvoice System settings',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function SystemsettingsMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <SystemsettingsList  
                    
                     dataIn={{ parentUseEffectKey: "loadSystemsettingsList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateSystemsettingsEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }