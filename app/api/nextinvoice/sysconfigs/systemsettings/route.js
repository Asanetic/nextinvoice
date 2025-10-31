
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {SystemsettingsRowMutations} from './SystemsettingsRowMutations';

import listSystemsettingsRowMutationsKeys from './SystemsettingsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddSystemsettings, UpdateSystemsettings } from './SystemsettingsDbGateway';


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
      tbl: 'account_urls',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('account_urls', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('account_urls', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listSystemsettingsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, SystemsettingsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Systemsettings data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Systemsettings failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SystemsettingsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SystemsettingsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SystemsettingsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SystemsettingsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SystemsettingsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const SystemsettingsFormAction = body.account_urls_mosy_action;
    const account_urls_uptoken_value = base64Decode(body.account_urls_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  account_urls inputs array ---// 
  const SystemsettingsInputsArr = {

    "url_name" : "?", 
    "url" : "?", 
    "description" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End account_urls inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('account_urls',SystemsettingsInputsArr, SystemsettingsRequest, newId, authData)

    if (SystemsettingsFormAction === "add_account_urls") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Systemsettings
      const result = await AddSystemsettings(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        account_urls_uptoken: result.record_id
      });
      
    }
    
    if (SystemsettingsFormAction === "update_account_urls") {
      
      // update table Systemsettings
      const result = await UpdateSystemsettings(newId, mutatedDataArray, body, authData, `primkey='${account_urls_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        account_urls_uptoken: account_urls_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${SystemsettingsFormAction}`
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