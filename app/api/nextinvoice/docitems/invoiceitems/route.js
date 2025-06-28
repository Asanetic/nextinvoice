
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {InvoiceitemsRowMutations} from './InvoiceitemsRowMutations';

import listInvoiceitemsRowMutationsKeys from './InvoiceitemsMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddInvoiceitems, UpdateInvoiceitems } from './InvoiceitemsDbGateway';


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
      tbl: 'invoice_items',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('invoice_items', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('invoice_items', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listInvoiceitemsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, InvoiceitemsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Invoiceitems data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Invoiceitems failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(InvoiceitemsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = InvoiceitemsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await InvoiceitemsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await InvoiceitemsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(InvoiceitemsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const InvoiceitemsFormAction = body.invoice_items_mosy_action;
    const invoice_items_uptoken_value = base64Decode(body.invoice_items_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  invoice_items inputs array ---// 
  const InvoiceitemsInputsArr = {

    "invoice_id" : "?", 
    "item_id" : "?", 
    "item_remark" : "?", 
    "quantity" : "?", 
    "rate" : "?", 
    "date_created" : "?", 
    "item_name" : "?", 
    "tax" : "?", 
    "discount" : "?", 
    "account_context" : "?", 
    "account_name" : "?", 
    "item_key" : "?", 
    "stock_type" : "?", 
    "invoice_edit_key" : "?", 
    "selling_price" : "?", 
    "sale_state" : "?", 
    "remaining_qty" : "?", 
    "add_to_stock" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End invoice_items inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('invoice_items',InvoiceitemsInputsArr, InvoiceitemsRequest, newId, authData)

    if (InvoiceitemsFormAction === "add_invoice_items") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Invoiceitems
      const result = await AddInvoiceitems(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        invoice_items_uptoken: result.record_id
      });
      
    }
    
    if (InvoiceitemsFormAction === "update_invoice_items") {
      
      // update table Invoiceitems
      const result = await UpdateInvoiceitems(newId, mutatedDataArray, body, authData, `primkey='${invoice_items_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        invoice_items_uptoken: invoice_items_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${InvoiceitemsFormAction}`
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