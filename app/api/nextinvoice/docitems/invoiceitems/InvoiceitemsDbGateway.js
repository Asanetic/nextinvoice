
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";
import { addInventoryItem } from "../../nextinvoice_functions";


//insert invoice_items 
export async function AddInvoiceitems(newId, mutatedDataArray, body, authData)
{

  let newItemId = body.txt_item_id
  if(body.txt_item_id =="")
  {
    newItemId = newId
  }

  mutatedDataArray.item_name = body.txt__inventory_item_name_item_id
  mutatedDataArray.item_id = newItemId
  
  await addInventoryItem(body, newId, authData)
  
  const result = await mosySqlInsert("invoice_items", mutatedDataArray, body);
  
  console.log(`add invoie items ${newId}`)
  
  return result;
}


//update invoice_items 
export async function UpdateInvoiceitems(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("invoice_items", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete invoice_items 
export async function DeleteInvoiceitems(tokenId, whereStr)
{  
  const result = await mosySqlDelete("invoice_items", whereStr);

  return result;
}

