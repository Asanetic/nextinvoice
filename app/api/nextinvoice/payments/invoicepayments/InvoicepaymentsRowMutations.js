
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Invoicepayments 
export const InvoicepaymentsRowMutations = {

  //dope  _invoices_invoice_no_invoice_id column to the response
  _invoices_invoice_no_invoice_id : async (row)=>{

    const data_res = await mosyQddata("invoices", "invoice_id", row.invoice_id);
    return data_res?.invoice_no ?? row.invoice_id;

  },

  
  //dope invoice_key column to the response              
  invoice_key: async (row) => {

    const data_res = await mosyFlexQuickSel("invoices", "primkey",`where invoice_id ='${row?.invoice_id}'`,"r");

    return data_res?.primkey;

  }
}
