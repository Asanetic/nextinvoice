
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert leads_list 
export async function AddLeadslist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("leads_list", mutatedDataArray, body);
   
  return result;
}


//update leads_list 
export async function UpdateLeadslist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("leads_list", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete leads_list 
export async function DeleteLeadslist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("leads_list", whereStr);

  return result;
}

