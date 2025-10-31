
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert account_urls 
export async function AddSystemsettings(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("account_urls", mutatedDataArray, body);
   
  return result;
}


//update account_urls 
export async function UpdateSystemsettings(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("account_urls", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete account_urls 
export async function DeleteSystemsettings(tokenId, whereStr)
{  
  const result = await mosySqlDelete("account_urls", whereStr);

  return result;
}

