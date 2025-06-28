
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert inventory 
export async function AddProductandservices(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("inventory", mutatedDataArray, body);
   
  return result;
}


//update inventory 
export async function UpdateProductandservices(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("inventory", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete inventory 
export async function DeleteProductandservices(tokenId, whereStr)
{  
  const result = await mosySqlDelete("inventory", whereStr);

  return result;
}

