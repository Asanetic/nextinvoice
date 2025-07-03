
import { base64Decode, mosyFlexSelect , mosyQddata, mosySumRows, mosyCountRows , mosyQuickSel, mosyFlexQuickSel} from '../../../apiUtils/dataControl/dataUtils';

//computed column mutations for Clientlist 
export const ClientlistRowMutations = {

  //dope  _clients_client_name_client_id column to the response
  _clients_client_name_client_id : async (row)=>{

    const data_res = await mosyQddata("clients", "client_id", row.client_id);
    return data_res?.client_name ?? row.client_id;

  }
}
