
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {InvoicepaymentsRowMutations} from './InvoicepaymentsRowMutations';

import listInvoicepaymentsRowMutationsKeys from './InvoicepaymentsMutationKeys';

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
      tbl: 'invoice_payments',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    let requestValid =validateSelect('invoice_payments', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listInvoicepaymentsRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, InvoicepaymentsRowMutations);

      return Response.json({
        status: 'success',
        message: 'Invoicepayments data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Invoicepayments failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(InvoicepaymentsRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = InvoicepaymentsRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await InvoicepaymentsRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await InvoicepaymentsRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(InvoicepaymentsRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const InvoicepaymentsFormAction = body.invoice_payments_mosy_action;
    const invoice_payments_uptoken_value = base64Decode(body.invoice_payments_uptoken);

		//--- Begin  invoice_payments inputs array ---// 

const InvoicepaymentsInputsArr = {
  "invoice_id" : "?", 
  "date_paid" : "?", 
  "amount_paid" : "?", 
  "balance" : "?", 
  "ref_no" : "?", 
  "payment_mode" : "?", 
  "remark" : "?", 
  "hive_site_id" : "?", 
  "hive_site_name" : "?", 
  "invoice_no" : "?", 

};

//--- End invoice_payments inputs array --//

    
    if (InvoicepaymentsFormAction === "add_invoice_payments") 
    {
      
      const newId = magicRandomStr(7);
      InvoicepaymentsInputsArr.record_id = newId;
      
      // Insert into table Invoicepayments
      const result = await mosySqlInsert("invoice_payments", InvoicepaymentsInputsArr, body);

       

      return Response.json({
        status: 'success',
        message: result.message,
        invoice_payments_uptoken: result.record_id
      });
      
    }
    
    if (InvoicepaymentsFormAction === "update_invoice_payments") {
      
      // update table Invoicepayments
      const result = await mosySqlUpdate("invoice_payments", InvoicepaymentsInputsArr, body, `primkey='${invoice_payments_uptoken_value}'`);


      

      return Response.json({
        status: 'success',
        message: result.message,
        invoice_payments_uptoken: invoice_payments_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${InvoicepaymentsFormAction}`
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