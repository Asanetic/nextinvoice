
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {ClientlistRowMutations} from './ClientlistRowMutations';

import listClientlistRowMutationsKeys from './ClientlistMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddClientlist, UpdateClientlist } from './ClientlistDbGateway';


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
      tbl: 'clients',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('clients', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('clients', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listClientlistRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, ClientlistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Clientlist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Clientlist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ClientlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ClientlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ClientlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ClientlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ClientlistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const ClientlistFormAction = body.clients_mosy_action;
    const clients_uptoken_value = base64Decode(body.clients_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  clients inputs array ---// 
  const ClientlistInputsArr = {

    "client_name" : "?", 
    "client_email" : "?", 
    "client_tel" : "?", 
    "client_location" : "?", 
    "client_photo" : "?", 
    "gender" : "?", 
    "date_registered" : "?", 
    "password" : "?", 
    "admin_id" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End clients inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('clients',ClientlistInputsArr, ClientlistRequest, newId, authData)

    if (ClientlistFormAction === "add_clients") 
    {
      
      mutatedDataArray.client_id = newId;
      
      // Insert into table Clientlist
      const result = await AddClientlist(newId, mutatedDataArray, body, authData);     

      
      return Response.json({
        status: 'success',
        message: result.message,
        clients_uptoken: result.record_id
      });
      
    }
    
    if (ClientlistFormAction === "update_clients") {
      
      // update table Clientlist
      const result = await UpdateClientlist(newId, mutatedDataArray, body, authData, `primkey='${clients_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        clients_uptoken: clients_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${ClientlistFormAction}`
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