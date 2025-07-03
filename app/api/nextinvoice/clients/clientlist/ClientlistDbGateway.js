
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert clients 
export async function AddClientlist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("clients", mutatedDataArray, body);
  console.log(`AddClientlistAddClientlistAddClientlist AddClientlistAddClientlist`)   
  return result;
}


//update clients 
export async function UpdateClientlist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("clients", mutatedDataArray, body, whereStr);
  console.log(`UpdateClientlistUpdateClientlist UpdateClientlist`)   

  return result;
}


//delete clients 
export async function DeleteClientlist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("clients", whereStr);
  console.log(`DeleteClientlist DeleteClientlistDeleteClientlistDeleteClientlist`)   

  return result;
}

