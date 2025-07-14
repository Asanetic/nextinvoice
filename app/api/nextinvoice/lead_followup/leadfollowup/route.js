
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {LeadfollowupRowMutations} from './LeadfollowupRowMutations';

import listLeadfollowupRowMutationsKeys from './LeadfollowupMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddLeadfollowup, UpdateLeadfollowup } from './LeadfollowupDbGateway';


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
      tbl: 'lead_followup',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('lead_followup', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('lead_followup', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listLeadfollowupRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, LeadfollowupRowMutations);

      return Response.json({
        status: 'success',
        message: 'Leadfollowup data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Leadfollowup failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(LeadfollowupRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = LeadfollowupRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await LeadfollowupRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await LeadfollowupRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(LeadfollowupRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const LeadfollowupFormAction = body.lead_followup_mosy_action;
    const lead_followup_uptoken_value = base64Decode(body.lead_followup_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  lead_followup inputs array ---// 
  const LeadfollowupInputsArr = {

    "lead_id" : "?", 
    "followup_type" : "?", 
    "followup_date" : "?", 
    "status" : "?", 
    "potential" : "?", 
    "stage" : "?", 
    "remark" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End lead_followup inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('lead_followup',LeadfollowupInputsArr, LeadfollowupRequest, newId, authData)

    if (LeadfollowupFormAction === "add_lead_followup") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Leadfollowup
      const result = await AddLeadfollowup(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        lead_followup_uptoken: result.record_id
      });
      
    }
    
    if (LeadfollowupFormAction === "update_lead_followup") {
      
      // update table Leadfollowup
      const result = await UpdateLeadfollowup(newId, mutatedDataArray, body, authData, `primkey='${lead_followup_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        lead_followup_uptoken: lead_followup_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${LeadfollowupFormAction}`
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