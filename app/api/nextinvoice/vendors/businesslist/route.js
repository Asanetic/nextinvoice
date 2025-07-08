
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {BusinesslistRowMutations} from './BusinesslistRowMutations';

import listBusinesslistRowMutationsKeys from './BusinesslistMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddBusinesslist, UpdateBusinesslist } from './BusinesslistDbGateway';


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
      tbl: 'companies',
      colstr: queryParams.colstr || 'Kg==', // default to *
      ...queryParams 
    };

    // 🧠 Clean up optional params if missing
    if (!enhancedParams.pagination) delete enhancedParams.pagination;
    if (!enhancedParams.q) delete enhancedParams.q;
    if (!enhancedParams.function_cols) enhancedParams.function_cols = '';

    //append further queries to client query request , account filters order by group by  etc
    const mutatedQparam = mosyMutateQuery('companies', searchParams, authData, 'primkey')

    enhancedParams.q=mutatedQparam
    
    let requestValid =validateSelect('companies', queryParams, authData)

    if(!requestValid)
    {
      return Response.json(
        { status: 'error', message: 'Request is invalid' },
        { status: 400 }
      );

    }
 
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
    const mutationsObj = isEmpty(requestedMutationsObj) ? listBusinesslistRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, BusinesslistRowMutations);

      return Response.json({
        status: 'success',
        message: 'Businesslist data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Businesslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(BusinesslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = BusinesslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await BusinesslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await BusinesslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(BusinesslistRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const BusinesslistFormAction = body.companies_mosy_action;
    const companies_uptoken_value = base64Decode(body.companies_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  companies inputs array ---// 
  const BusinesslistInputsArr = {

    "business_name" : "?", 
    "mobile" : "?", 
    "email" : "?", 
    "location" : "?", 
    "business_no" : "?", 
    "name" : "?", 
    "specialty" : "?", 
    "remark" : "?", 
    "logo" : "?", 
    "bank_name" : "?", 
    "account_no" : "?", 
    "pin_no" : "?", 
    "swort_code" : "?", 
    "hive_site_id" : "?", 
    "hive_site_name" : "?", 

  };

  //--- End companies inputs array --//

    //mutate requested values
    const mutatedDataArray =mutateInputArray('companies',BusinesslistInputsArr, BusinesslistRequest, newId, authData)

    if (BusinesslistFormAction === "add_companies") 
    {
      
      mutatedDataArray.company_id = newId;
      
      // Insert into table Businesslist
      const result = await AddBusinesslist(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for logo, if any
                if (body.txt_companies_logo) {
                  if(body["txt_companies_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_companies_logo"], "media/companies");
                    
                    BusinesslistInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateBusinesslist(newId, { logo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_companies_logo;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        companies_uptoken: result.record_id
      });
      
    }
    
    if (BusinesslistFormAction === "update_companies") {
      
      // update table Businesslist
      const result = await UpdateBusinesslist(newId, mutatedDataArray, body, authData, `primkey='${companies_uptoken_value}'`)

      
                // Now handle the file upload for logo, if any
                if (body.txt_companies_logo) {
                  if(body["txt_companies_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "txt_companies_logo"], "media/companies");
                    
                    BusinesslistInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateBusinesslist(newId, { logo: filePath }, body, authData,  `primkey='${companies_uptoken_value}'`)
                    
                    let fileToDelete = body.media_companies_logo;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        companies_uptoken: companies_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${BusinesslistFormAction}`
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