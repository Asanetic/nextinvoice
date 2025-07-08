
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert invoice_payments 
export async function AddInvoicepayments(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("invoice_payments", mutatedDataArray, body);
   
  return result;
}


//update invoice_payments 
export async function UpdateInvoicepayments(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("invoice_payments", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete invoice_payments 
export async function DeleteInvoicepayments(tokenId, whereStr)
{  
  const result = await mosySqlDelete("invoice_payments", whereStr);

  return result;
}

