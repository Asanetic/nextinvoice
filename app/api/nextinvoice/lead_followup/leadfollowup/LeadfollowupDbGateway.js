
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert lead_followup 
export async function AddLeadfollowup(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("lead_followup", mutatedDataArray, body);
   
  return result;
}


//update lead_followup 
export async function UpdateLeadfollowup(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("lead_followup", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete lead_followup 
export async function DeleteLeadfollowup(tokenId, whereStr)
{  
  const result = await mosySqlDelete("lead_followup", whereStr);

  return result;
}

