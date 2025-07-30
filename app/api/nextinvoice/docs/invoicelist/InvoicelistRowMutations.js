
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Invoicelist 
export const InvoicelistRowMutations = {

  //dope  _clients_client_name_client_id column to the response
  _clients_client_name_client_id : async (row)=>{

    const data_res = await mosyQddata("clients", "client_id", row.client_id);
    return data_res?.client_name ?? row.client_id;

  },

  
  //dope subtotal column to the response              
  subtotal: async (row) => {

    const data_res = await mosySumRows("invoice_items", `(rate*quantity)`, `where invoice_id ='${row?.invoice_id}'`);

    return data_res;

  },

  
  //dope grand_total column to the response              
  grand_total: async (row) => {

    const data_res = await (Number(row?.subtotal) - Number(row?.discount));

    return data_res;

  },

  
  //dope amount_paid column to the response              
  amount_paid: async (row) => {

    const data_res = await mosySumRows("invoice_payments", "amount_paid", `where invoice_id ='${row?.invoice_id}'`);

    return data_res;

  },

  
  //dope invoice_balance column to the response              
  invoice_balance: async (row) => {

    const data_res = await (Number(row?.grand_total) - Number(row?.amount_paid));

    return data_res;

  },

  //dope  _companies_business_name_vendor_name column to the response
  _companies_business_name_vendor_name : async (row)=>{

    const data_res = await mosyQddata("companies", "company_id", row.vendor_name);
    return data_res?.business_name ?? row.vendor_name;

  }
}
