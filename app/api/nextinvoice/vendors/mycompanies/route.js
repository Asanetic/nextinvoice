
//utils 
import { mosySqlInsert, mosySqlUpdate, base64Decode, mosyFlexSelect, mosyUploadFile, mosyDeleteFile, magicRandomStr } from '../../../apiUtils/dataControl/dataUtils';

import {MycompaniesRowMutations} from './MycompaniesRowMutations';

import listMycompaniesRowMutationsKeys from './MycompaniesMutationKeys';

//be gate keeper and auth 
import { validateSelect , mosyMutateQuery, mutateInputArray } from '../../beMonitor';
import { processAuthToken } from '../../../auth/authManager';

import { AddMycompanies, UpdateMycompanies } from './MycompaniesDbGateway';


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
    const mutationsObj = isEmpty(requestedMutationsObj) ? listMycompaniesRowMutationsKeys : requestedMutationsObj;
    
    if(requestValid){
    
      const result = await mosyFlexSelect(enhancedParams, mutationsObj, MycompaniesRowMutations);

      return Response.json({
        status: 'success',
        message: 'Mycompanies data retrieved',
        ...result,
      });
      
   }
  } catch (err) {
    console.error('GET Mycompanies failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(MycompaniesRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = MycompaniesRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await MycompaniesRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await MycompaniesRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(MycompaniesRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    const MycompaniesFormAction = body.companies_mosy_action;
    const companies_uptoken_value = base64Decode(body.companies_uptoken);
    
    const newId = magicRandomStr(7);


		
  
  //--- Begin  companies inputs array ---// 
  const MycompaniesInputsArr = {

    "business_no" : "?", 
    "name" : "?", 
    "mobile" : "?", 
    "email" : "?", 
    "business_name" : "?", 
    "location" : "?", 
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
    const mutatedDataArray =mutateInputArray('companies',MycompaniesInputsArr, MycompaniesRequest, newId, authData)

    if (MycompaniesFormAction === "add_companies") 
    {
      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Mycompanies
      const result = await AddMycompanies(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        companies_uptoken: result.record_id
      });
      
    }
    
    if (MycompaniesFormAction === "update_companies") {
      
      // update table Mycompanies
      const result = await UpdateMycompanies(newId, mutatedDataArray, body, authData, `primkey='${companies_uptoken_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        companies_uptoken: companies_uptoken_value
      });
    }    

    // Optional: catch unrecognized actions
    return Response.json({
      status: 'error',
      message: `Invalid action: ${MycompaniesFormAction}`
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