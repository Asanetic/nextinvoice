
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert sales_script 
export async function AddSalesscript(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("sales_script", mutatedDataArray, body);
   
  return result;
}


//update sales_script 
export async function UpdateSalesscript(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("sales_script", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete sales_script 
export async function DeleteSalesscript(tokenId, whereStr)
{  
  const result = await mosySqlDelete("sales_script", whereStr);

  return result;
}

