import { Suspense } from 'react';

import ProductandservicesProfile from '../uiControl/ProductandservicesProfile';

import { InteprateProductandservicesEvent } from '../dataControl/ProductandservicesRequestHandler';

    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Product and Services profile"//searchParams?.mosyTitle || "Product and Services";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Product and Services profile`,
    description: 'nextinvoice Product and Services',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}
                      

export default function ProductandservicesMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ProductandservicesProfile 
                    dataIn={{ parentUseEffectKey: "initProductandservicesProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateProductandservicesEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}