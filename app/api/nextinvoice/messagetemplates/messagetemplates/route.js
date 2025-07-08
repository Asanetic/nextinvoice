
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {MessagetemplatesRowMutations} from './MessagetemplatesRowMutations';

import listMessagetemplatesRowMutationsKeys from './MessagetemplatesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddMessagetemplates, UpdateMessagetemplates } from './MessagetemplatesDbGateway';


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
      tbl: 'message_templates',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('message_templates', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('message_templates', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listMessagetemplatesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, MessagetemplatesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Messagetemplates data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Messagetemplates failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(MessagetemplatesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessagetemplatesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessagetemplatesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessagetemplatesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessagetemplatesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const MessagetemplatesFormAction = body.message_templates_mosy_action;
    const message_templates_uptoken_value = base64Decode(body.message_templates_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  message_templates inputs array ---// 
  const MessagetemplatesInputsArr = {

    "template_name" : "?", 
    "template_code" : "?", 
    "message_template" : "?", 
    "message_subject" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End message_templates inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('message_templates',MessagetemplatesInputsArr, MessagetemplatesRequest, newId, authData)

    if (MessagetemplatesFormAction === "add_message_templates") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Messagetemplates
      const result = await AddMessagetemplates(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        message_templates_uptoken: result.record_id
      });
      
    }
    
    if (MessagetemplatesFormAction === "update_message_templates") {
      
      // update table Messagetemplates
      const result = await UpdateMessagetemplates(newId, mutatedDataArray, body, authData, `primkey='${message_templates_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        message_templates_uptoken: message_templates_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${MessagetemplatesFormAction}`
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