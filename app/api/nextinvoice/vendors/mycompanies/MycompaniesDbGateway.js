
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert companies 
export async function AddMycompanies(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("companies", mutatedDataArray, body);
   
  return result;
}


//update companies 
export async function UpdateMycompanies(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("companies", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete companies 
export async function DeleteMycompanies(tokenId, whereStr)
{  
  const result = await mosySqlDelete("companies", whereStr);

  return result;
}

