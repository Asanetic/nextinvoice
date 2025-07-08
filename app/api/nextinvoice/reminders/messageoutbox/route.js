
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {MessageoutboxRowMutations} from './MessageoutboxRowMutations';

import listMessageoutboxRowMutationsKeys from './MessageoutboxMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddMessageoutbox, UpdateMessageoutbox } from './MessageoutboxDbGateway';


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
      tbl: 'messaging',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('messaging', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('messaging', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listMessageoutboxRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, MessageoutboxRowMutations);

      return Response.json({
        status: 'success',
        message: 'Messageoutbox data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Messageoutbox failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(MessageoutboxRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MessageoutboxRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MessageoutboxRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MessageoutboxRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MessageoutboxRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const MessageoutboxFormAction = body.messaging_mosy_action;
    const messaging_uptoken_value = base64Decode(body.messaging_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  messaging inputs array ---// 
  const MessageoutboxInputsArr = {

    "ref_number" : "?", 
    "receiver_tel" : "?", 
    "receiver_email" : "?", 
    "subject" : "?", 
    "message_details" : "?", 
    "receiver_contacts" : "?", 
    "reciver_names" : "?", 
    "message_type" : "?", 
    "site_id" : "?", 
    "group_name" : "?", 
    "message_date" : "?", 
    "sent_state" : "?", 
    "msg_read_state" : "?", 
    "message_label" : "?", 
    "sms_cost" : "?", 
    "page_count" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "custom_dictionary" : "?", 
    "message_signature" : "?", 

  };

  //--- End messaging inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('messaging',MessageoutboxInputsArr, MessageoutboxRequest, newId, authData)

    if (MessageoutboxFormAction === "add_messaging") 
    {
      
      mutatedDataArray.messageid = newId;
      
      // Insert into table Messageoutbox
      const result = await AddMessageoutbox(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        messaging_uptoken: result.record_id
      });
      
    }
    
    if (MessageoutboxFormAction === "update_messaging") {
      
      // update table Messageoutbox
      const result = await UpdateMessageoutbox(newId, mutatedDataArray, body, authData, `primkey='${messaging_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        messaging_uptoken: messaging_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${MessageoutboxFormAction}`
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