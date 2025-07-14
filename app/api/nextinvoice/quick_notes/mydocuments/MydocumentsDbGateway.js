
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert quick_notes 
export async function AddMydocuments(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("quick_notes", mutatedDataArray, body);
   
  return result;
}


//update quick_notes 
export async function UpdateMydocuments(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("quick_notes", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete quick_notes 
export async function DeleteMydocuments(tokenId, whereStr)
{  
  const result = await mosySqlDelete("quick_notes", whereStr);

  return result;
}

