
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert invoices 
export async function AddQuotationlist(newId, mutatedDataArray, body, authData)
{

  mutatedDataArray.invoice_type="Quotation"
  
  const result = await mosySqlInsert("invoices", mutatedDataArray, body);
   
  return result;
}


//update invoices 
export async function UpdateQuotationlist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("invoices", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete invoices 
export async function DeleteQuotationlist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("invoices", whereStr);

  return result;
}

