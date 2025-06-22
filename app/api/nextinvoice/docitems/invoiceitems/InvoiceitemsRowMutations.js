
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Invoiceitems 
export const InvoiceitemsRowMutations = {

  //dope  _invoices_invoice_no_invoice_id column to the response
  _invoices_invoice_no_invoice_id : async (row)=>{

    const data_res = await mosyQddata("invoices", "invoice_id", row.invoice_id);
    return data_res?.invoice_no ?? row.invoice_id;

  },

  
  //dope totals column to the response              
  totals: async (row) => {

    const data_res = row?.quantity*row?.rate;

    return data_res;

  },

  //dope  _inventory_item_name_item_id column to the response
  _inventory_item_name_item_id : async (row)=>{

    const data_res = await mosyQddata("inventory", "record_id", row.item_id);
    return data_res?.item_name ?? row.item_id;

  }
}
