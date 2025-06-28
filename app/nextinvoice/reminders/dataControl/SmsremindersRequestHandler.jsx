'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertSmsreminders() {
 //console.log(`Form messaging insert sent `)

  return await mosyPostFormData({
    formId: 'messaging_profile_form',
    url: '/api/nextinvoice/reminders/smsreminders',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateSmsreminders() {

  //console.log(`Form messaging update sent `)

  return await mosyPostFormData({
    formId: 'messaging_profile_form',
    url: '/api/nextinvoice/reminders/smsreminders',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateSmsremindersFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('messaging_mosy_action');
 
 //console.log(`Form messaging submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_messaging') {

      actionMessage ='Record added succesfully!';

      result = await insertSmsreminders();
    }

    if (actionType === 'update_messaging') {

      actionMessage ='Record updated succesfully!';

      result = await updateSmsreminders();
    }

    if (result?.status === 'success') {
      
      const messagingUptoken = btoa(result.messaging_uptoken || '');

      //set id key
      setters.setSmsremindersUptoken(messagingUptoken);
      
      //update url with new messagingUptoken
      mosyUpdateUrlParam('messaging_uptoken', messagingUptoken)

      setters.setSmsremindersActionStatus('update_messaging')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: messagingUptoken,
        actionName : actionType,
        actionType : 'messaging_form_submission'
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


export async function initSmsremindersProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_ref_number : [],

  }
  

  MosyNotify({message : 'Refreshing Sms Reminders' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/reminders/smsreminders',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSmsremindersProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('reminders Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching reminders data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSmsreminders(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/reminders/delete',
        params: { 
          _messaging_delete_record: (token), 
          },
      });

      console.log('Token DeleteSmsreminders '+token)
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


export async function getSmsremindersListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa('')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_ref_number : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qmessaging_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/reminders/smsreminders',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qmessaging_page:${recordsPerPage}:${pageNo}`,
        aw:btoa(`order by primkey desc`),
        src : btoa(`getSmsremindersListData`)        
        },
    });

    if (response.status === 'success') {
      //console.log('reminders Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching reminders data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSmsremindersListData(customQueryStr, setters) {

    const gftSmsreminders = MosyFilterEngine('messaging', true);
    let finalFilterStr = btoa(gftSmsreminders);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSmsremindersLoading(true);
    
    const smsremindersListData = await getSmsremindersListData(finalFilterStr);
    
    setters.setSmsremindersLoading(false)
    setters.setSmsremindersListData(smsremindersListData?.data)

    setters.setSmsremindersListPageCount(smsremindersListData?.page_count)


    return smsremindersListData

}
  
  
export async function smsremindersProfileData(customQueryStr, setters, router, customProfileData={}) {

    const smsremindersTokenId = mosyUrlParam('messaging_uptoken');
    
    const deleteParam = mosyUrlParam('messaging_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSmsremindersToken = '0';
    if (smsremindersTokenId) {
      
      decodedSmsremindersToken = atob(smsremindersTokenId); // Decode the record_id
      setters.setSmsremindersUptoken(smsremindersTokenId);
      setters.setSmsremindersActionStatus('update_messaging');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSmsremindersQueryStr =`where primkey ='${decodedSmsremindersToken}'`
    if(customQueryStr!='')
    {
      rawSmsremindersQueryStr = customQueryStr
    }

    const profileDataRecord = await initSmsremindersProfileData(rawSmsremindersQueryStr)

    if(deleteParam){
      popDeleteDialog(smsremindersTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSmsremindersNode(finalProfileData)
    
    


}
  
  

export function InteprateSmsremindersEvent(data) {
     
  //console.log('🎯 Smsreminders Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_messaging){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSmsremindersCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('messaging_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_messaging){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add messaging `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_messaging){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update messaging `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_messaging){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../reminders/smslist')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSmsreminders(deleteToken).then(data=>{
  
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
       deleteUrlParam('messaging_delete');
        
    }
  
  });

}