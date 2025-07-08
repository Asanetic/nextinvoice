import { Suspense } from 'react';

import MycompaniesProfile from '../uiControl/MycompaniesProfile';

import { InteprateMycompaniesEvent } from '../dataControl/MycompaniesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "My companies profile"//searchParams?.mosyTitle || "My companies";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `My companies profile`,
    description: 'nextinvoice My companies',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function MycompaniesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <MycompaniesProfile 
                    dataIn={{ parentUseEffectKey: "initMycompaniesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateMycompaniesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}