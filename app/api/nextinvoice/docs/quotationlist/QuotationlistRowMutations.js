
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Quotationlist 
export const QuotationlistRowMutations = {

  //dope  _clients_client_name_client_id column to the response
  _clients_client_name_client_id : async (row)=>{

    const data_res = await mosyQddata("clients", "client_id", row.client_id);
    return data_res?.client_name ?? row.client_id;

  },

  //dope  _companies_business_name_vendor_name column to the response
  _companies_business_name_vendor_name : async (row)=>{

    const data_res = await mosyQddata("companies", "company_id", row.vendor_name);
    return data_res?.business_name ?? row.vendor_name;

  }
}
