'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertClientlist() {
 //console.log(`Form clients insert sent `)

  return await mosyPostFormData({
    formId: 'clients_profile_form',
    url: '/api/nextinvoice/clients/clientlist',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateClientlist() {

  //console.log(`Form clients update sent `)

  return await mosyPostFormData({
    formId: 'clients_profile_form',
    url: '/api/nextinvoice/clients/clientlist',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateClientlistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('clients_mosy_action');
 
 //console.log(`Form clients submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_clients') {

      actionMessage ='Record added succesfully!';

      result = await insertClientlist();
    }

    if (actionType === 'update_clients') {

      actionMessage ='Record updated succesfully!';

      result = await updateClientlist();
    }

    if (result?.status === 'success') {
      
      const clientsUptoken = btoa(result.clients_uptoken || '');

      //set id key
      setters.setClientlistUptoken(clientsUptoken);
      
      //update url with new clientsUptoken
      mosyUpdateUrlParam('clients_uptoken', clientsUptoken)

      setters.setClientlistActionStatus('update_clients')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: clientsUptoken,
        actionName : actionType,
        actionType : 'clients_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initClientlistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],

  }
  

  MosyNotify({message : 'Refreshing Client List' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/clients/clientlist',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('clients Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching clients data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteClientlist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/clients/delete',
        params: { 
          _clients_delete_record: (token), 
          },
      });

      console.log('Token DeleteClientlist '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // ✅ Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getClientlistListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(' order by primkey desc')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qclients_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/clients/clientlist',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qclients_page:${recordsPerPage}:${pageNo}`
        },
    });

    if (response.status === 'success') {
      //console.log('clients Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching clients data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadClientlistListData(customQueryStr, setters) {

    const gftClientlist = MosyFilterEngine('clients', true);
    let finalFilterStr = btoa(gftClientlist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setClientlistLoading(true);
    
    const clientlistListData = await getClientlistListData(finalFilterStr);
    
    setters.setClientlistLoading(false)
    setters.setClientlistListData(clientlistListData?.data)

    setters.setClientlistListPageCount(clientlistListData?.page_count)


    return clientlistListData

}
  
  
export async function clientlistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const clientlistTokenId = mosyUrlParam('clients_uptoken');
    
    const deleteParam = mosyUrlParam('clients_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedClientlistToken = '0';
    if (clientlistTokenId) {
      
      decodedClientlistToken = atob(clientlistTokenId); // Decode the record_id
      setters.setClientlistUptoken(clientlistTokenId);
      setters.setClientlistActionStatus('update_clients');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawClientlistQueryStr =`where primkey ='${decodedClientlistToken}'`
    if(customQueryStr!='')
    {
      rawClientlistQueryStr = customQueryStr
    }

    const profileDataRecord = await initClientlistProfileData(rawClientlistQueryStr)

    if(deleteParam){
      popDeleteDialog(clientlistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setClientlistNode(finalProfileData)
    
    


}
  
  

export function InteprateClientlistEvent(data) {
     
  //console.log('🎯 Clientlist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_clients){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setClientlistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('clients_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_clients){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add clients `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_clients){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update clients `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_clients){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../clients/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteClientlist(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('clients_delete');
        
    }
  
  });

}