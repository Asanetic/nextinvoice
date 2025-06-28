
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {InvoicelistRowMutations} from './InvoicelistRowMutations';

import listInvoicelistRowMutationsKeys from './InvoicelistMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddInvoicelist, UpdateInvoicelist } from './InvoicelistDbGateway';


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
      tbl: 'invoices',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('invoices', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('invoices', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listInvoicelistRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, InvoicelistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Invoicelist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Invoicelist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(InvoicelistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = InvoicelistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await InvoicelistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await InvoicelistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(InvoicelistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const InvoicelistFormAction = body.invoices_mosy_action;
    const invoices_uptoken_value = base64Decode(body.invoices_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  invoices inputs array ---// 
  const InvoicelistInputsArr = {

    "invoice_no" : "?", 
    "date_due" : "?", 
    "client_id" : "?", 
    "invoice_amount" : "?", 
    "amount_paid" : "?", 
    "remark" : "?", 
    "date_created" : "?", 
    "paid_status" : "?", 
    "created_by" : "?", 
    "name" : "?", 
    "invoice_stage" : "?", 
    "paid_on" : "?", 
    "supplier_id" : "?", 
    "invoice_type" : "?", 
    "account_affect" : "?", 
    "inv_no_int" : "?", 
    "invoice_key" : "?", 
    "client_name" : "?", 
    "client_tel" : "?", 
    "client_email" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 
    "vendor_headers" : "?", 
    "client_headers" : "?", 
    "vendor_name" : "?", 
    "currency" : "?", 
    "discount" : "?", 
    "date_paid" : "?", 
    "ref_no" : "?", 
    "quotation" : "?", 
    "date_updated" : "?", 
    "folder" : "?", 
    "footnote" : "?", 

  };

  //--- End invoices inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('invoices',InvoicelistInputsArr, InvoicelistRequest, newId, authData)

    if (InvoicelistFormAction === "add_invoices") 
    {
      
      mutatedDataArray.invoice_id = newId;
      
      // Insert into table Invoicelist
      const result = await AddInvoicelist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        invoices_uptoken: result.record_id
      });
      
    }
    
    if (InvoicelistFormAction === "update_invoices") {
      
      // update table Invoicelist
      const result = await UpdateInvoicelist(newId, mutatedDataArray, body, authData, `primkey='${invoices_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        invoices_uptoken: invoices_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${InvoicelistFormAction}`
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