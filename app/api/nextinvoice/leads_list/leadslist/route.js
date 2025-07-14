
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {LeadslistRowMutations} from './LeadslistRowMutations';

import listLeadslistRowMutationsKeys from './LeadslistMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddLeadslist, UpdateLeadslist } from './LeadslistDbGateway';


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
      tbl: 'leads_list',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('leads_list', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('leads_list', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listLeadslistRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, LeadslistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Leadslist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Leadslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(LeadslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = LeadslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await LeadslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await LeadslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(LeadslistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const LeadslistFormAction = body.leads_list_mosy_action;
    const leads_list_uptoken_value = base64Decode(body.leads_list_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  leads_list inputs array ---// 
  const LeadslistInputsArr = {

    "name" : "?", 
    "tel" : "?", 
    "email" : "?", 
    "lead_date" : "?", 
    "source" : "?", 
    "campaign" : "?", 
    "cost" : "?", 
    "potential" : "?", 
    "stage" : "?", 
    "tag" : "?", 
    "remark" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End leads_list inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('leads_list',LeadslistInputsArr, LeadslistRequest, newId, authData)

    if (LeadslistFormAction === "add_leads_list") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Leadslist
      const result = await AddLeadslist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        leads_list_uptoken: result.record_id
      });
      
    }
    
    if (LeadslistFormAction === "update_leads_list") {
      
      // update table Leadslist
      const result = await UpdateLeadslist(newId, mutatedDataArray, body, authData, `primkey='${leads_list_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        leads_list_uptoken: leads_list_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${LeadslistFormAction}`
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