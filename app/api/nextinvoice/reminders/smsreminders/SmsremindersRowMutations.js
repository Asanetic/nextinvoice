
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Smsreminders 
export const SmsremindersRowMutations = {

  //dope  _invoices_invoice_no_ref_number column to the response
  _invoices_invoice_no_ref_number : async (row)=>{

    const data_res = await mosyQddata("invoices", "invoice_no", row.ref_number);
    return data_res?.invoice_no ?? row.ref_number;

  }
}
