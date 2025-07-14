
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Leadfollowup 
export const LeadfollowupRowMutations = {

  //dope  _leads_list_name_lead_id column to the response
  _leads_list_name_lead_id : async (row)=>{

    const data_res = await mosyQddata("leads_list", "record_id", row.lead_id);
    return data_res?.name ?? row.lead_id;

  }
}
