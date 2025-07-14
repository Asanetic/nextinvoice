'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';


//insert data
export async function insertLeadfollowup() {
 //console.log(`Form lead_followup insert sent `)

  return await mosyPostFormData({
    formId: 'lead_followup_profile_form',
    url: '/api/nextinvoice/lead_followup/leadfollowup',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateLeadfollowup() {

  //console.log(`Form lead_followup update sent `)

  return await mosyPostFormData({
    formId: 'lead_followup_profile_form',
    url: '/api/nextinvoice/lead_followup/leadfollowup',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateLeadfollowupFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('lead_followup_mosy_action');
 
 //console.log(`Form lead_followup submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_lead_followup') {

      actionMessage ='Record added succesfully!';

      result = await insertLeadfollowup();
    }

    if (actionType === 'update_lead_followup') {

      actionMessage ='Record updated succesfully!';

      result = await updateLeadfollowup();
    }

    if (result?.status === 'success') {
      
      const lead_followupUptoken = btoa(result.lead_followup_uptoken || '');

      //set id key
      setters.setLeadfollowupUptoken(lead_followupUptoken);
      
      //update url with new lead_followupUptoken
      mosyUpdateUrlParam('lead_followup_uptoken', lead_followupUptoken)

      setters.setLeadfollowupActionStatus('update_lead_followup')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: lead_followupUptoken,
        actionName : actionType,
        actionType : 'lead_followup_form_submission'
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


export async function initLeadfollowupProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _leads_list_name_lead_id : [],

  }
  

  MosyNotify({message : 'Refreshing Lead Followup' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/lead_followup/leadfollowup',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initLeadfollowupProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('lead_followup Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching lead_followup data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteLeadfollowup(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/lead_followup/delete',
        params: { 
          _lead_followup_delete_record: (token), 
          },
      });

      console.log('Token DeleteLeadfollowup '+token)
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


export async function getLeadfollowupListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _leads_list_name_lead_id : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qlead_followup_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/lead_followup/leadfollowup',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qlead_followup_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getLeadfollowupListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('lead_followup Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching lead_followup data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadLeadfollowupListData(customQueryStr, setters) {

    const gftLeadfollowup = MosyFilterEngine('lead_followup', true);
    let finalFilterStr = btoa(gftLeadfollowup);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setLeadfollowupLoading(true);
    
    const leadfollowupListData = await getLeadfollowupListData(finalFilterStr);
    
    setters.setLeadfollowupLoading(false)
    setters.setLeadfollowupListData(leadfollowupListData?.data)

    setters.setLeadfollowupListPageCount(leadfollowupListData?.page_count)


    return leadfollowupListData

}
  
  
export async function leadfollowupProfileData(customQueryStr, setters, router, customProfileData={}) {

    const leadfollowupTokenId = mosyUrlParam('lead_followup_uptoken');
    
    const deleteParam = mosyUrlParam('lead_followup_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedLeadfollowupToken = '0';
    if (leadfollowupTokenId) {
      
      decodedLeadfollowupToken = atob(leadfollowupTokenId); // Decode the record_id
      setters.setLeadfollowupUptoken(leadfollowupTokenId);
      setters.setLeadfollowupActionStatus('update_lead_followup');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawLeadfollowupQueryStr =`where primkey ='${decodedLeadfollowupToken}'`
    if(customQueryStr!='')
    {
      // if no lead_followup_uptoken set , use customQueryStr
      if (!leadfollowupTokenId) {
       rawLeadfollowupQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initLeadfollowupProfileData(rawLeadfollowupQueryStr)

    if(deleteParam){
      popDeleteDialog(leadfollowupTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setLeadfollowupNode(finalProfileData)
    
    
}
  
  

export function InteprateLeadfollowupEvent(data) {
     
  //console.log('🎯 Leadfollowup Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_lead_followup){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLeadfollowupCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('lead_followup_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_lead_followup){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add lead_followup `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_lead_followup){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update lead_followup `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_lead_followup){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../lead_followup/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteLeadfollowup(deleteToken).then(data=>{
  
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
       deleteUrlParam('lead_followup_delete');
        
    }
  
  });

}