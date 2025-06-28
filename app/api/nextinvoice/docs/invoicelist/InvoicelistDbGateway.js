
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate , mosyFlexSelect, mosyFlexQuickSel, mosyQuickSel, base64Decode} from "../../../apiUtils/dataControl/dataUtils";
import { cloneInvoiceItems } from "../../nextinvoice_functions";

//insert invoices 
export async function AddInvoicelist(newId, mutatedDataArray, body, authData)
{

  mutatedDataArray.invoice_no= `${(body.txt_invoice_no).replace("QUOT", "CINV")}`  

  mutatedDataArray.invoice_type="Invoice"

  const invoiceKey = base64Decode(body.invoices_uptoken)

  console.log(`AddInvoicelistAddInvoicelistAddInvoicelist AddInvoicelist , invid ${body.txt_invoice_id} tokne ${body.invoices_uptoken}`)

  //get invoice details   
  const invoiceDetails = await mosyQuickSel("invoices", ` where primkey  = '${invoiceKey}'`, "r")

  const invoiceId_= invoiceDetails?.invoice_id;

  console.log(` invoiceDetails_____+++__+++__ ${invoiceId_}  keyyy ${invoiceKey}`, invoiceDetails)

  const invoiceItemsList = await mosyQuickSel("invoice_items", ` where invoice_id  = '${invoiceId_}'`)

  await cloneInvoiceItems(invoiceItemsList, newId, authData)

  const result = await mosySqlInsert("invoices", mutatedDataArray, body);
   
  return result;
}


//update invoices 
export async function UpdateInvoicelist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("invoices", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete invoices 
export async function DeleteInvoicelist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("invoices", whereStr);

  return result;
}

