import { Suspense } from 'react';

import ProductandservicesList from '../uiControl/ProductandservicesList';

import { InteprateProductandservicesEvent } from '../dataControl/ProductandservicesRequestHandler';
    
export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Product and services"//searchParams?.mosyTitle || "Product and services";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Product and services`,
    description: 'nextinvoice Product and services',
    
    icons: {
      icon: "/logo.png"
    },    
  };
}

export default function ProductandservicesMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ProductandservicesList  
                    
                     dataIn={{ parentUseEffectKey: "loadProductandservicesList" }}
                       
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