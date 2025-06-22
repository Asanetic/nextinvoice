
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {ProductandservicesRowMutations} from './ProductandservicesRowMutations';

import listProductandservicesRowMutationsKeys from './ProductandservicesMutationKeys';

//be gate keeper and auth 
import { validateSelect } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const encodedMutations = searchParams.get('mutations');

    let requestedMutationsObj = {};
    if (encodedMutations) {
      try {
        const decodedMutations = Buffer.from(encodedMutations, 'base64').toString('utf-8');
        requestedMutationsObj = JSON.parse(decodedMutations);
      } catch (err) {
        console.error('Mutation decode failed:', err);
      }
    }

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    

    // ✅ Provide default fallbacks
    const enhancedParams = {
      tbl: 'inventory',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('inventory', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listProductandservicesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, ProductandservicesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Productandservices data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Productandservices failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ProductandservicesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ProductandservicesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ProductandservicesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ProductandservicesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ProductandservicesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const ProductandservicesFormAction = body.inventory_mosy_action;
    const inventory_uptoken_value = base64Decode(body.inventory_uptoken);

		//--- Begin  inventory inputs array ---// 

const ProductandservicesInputsArr = {
  "item_name" : "?", 
  "quantity" : "?", 
  "rate" : "?", 
  "tax" : "?", 
  "discount" : "?", 
  "date_created" : "?", 
  "item_remark" : "?", 
  "hive_site_id" : "?", 
  "hive_site_name" : "?", 

};

//--- End inventory inputs array --//

    
    if (ProductandservicesFormAction === "add_inventory") 
    {
      
      const newId = magicRandomStr(7);
      ProductandservicesInputsArr.record_id = newId;
      
      // Insert into table Productandservices
      const result = await mosySqlInsert("inventory", ProductandservicesInputsArr, body); 

      return Response.json({
        status: 'success',
        message: result.message,
        inventory_uptoken: result.record_id
      });
      
    }
    
    if (ProductandservicesFormAction === "update_inventory") {
      
      // update table Productandservices
      const result = await mosySqlUpdate("inventory", ProductandservicesInputsArr, body, `primkey='${inventory_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        inventory_uptoken: inventory_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${ProductandservicesFormAction}`
    }, { status: 400 });

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}