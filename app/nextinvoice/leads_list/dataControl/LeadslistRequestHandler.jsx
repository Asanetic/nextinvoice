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
export async function insertLeadslist() {
 //console.log(`Form leads_list insert sent `)

  return await mosyPostFormData({
    formId: 'leads_list_profile_form',
    url: '/api/nextinvoice/leads_list/leadslist',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateLeadslist() {

  //console.log(`Form leads_list update sent `)

  return await mosyPostFormData({
    formId: 'leads_list_profile_form',
    url: '/api/nextinvoice/leads_list/leadslist',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateLeadslistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('leads_list_mosy_action');
 
 //console.log(`Form leads_list submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_leads_list') {

      actionMessage ='Record added succesfully!';

      result = await insertLeadslist();
    }

    if (actionType === 'update_leads_list') {

      actionMessage ='Record updated succesfully!';

      result = await updateLeadslist();
    }

    if (result?.status === 'success') {
      
      const leads_listUptoken = btoa(result.leads_list_uptoken || '');

      //set id key
      setters.setLeadslistUptoken(leads_listUptoken);
      
      //update url with new leads_listUptoken
      mosyUpdateUrlParam('leads_list_uptoken', leads_listUptoken)

      setters.setLeadslistActionStatus('update_leads_list')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: leads_listUptoken,
        actionName : actionType,
        actionType : 'leads_list_form_submission'
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


export async function initLeadslistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Leads List' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/leads_list/leadslist',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initLeadslistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('leads_list Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching leads_list data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteLeadslist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/leads_list/delete',
        params: { 
          _leads_list_delete_record: (token), 
          },
      });

      console.log('Token DeleteLeadslist '+token)
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


export async function getLeadslistListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
     
  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qleads_list_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/leads_list/leadslist',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qleads_list_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getLeadslistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('leads_list Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching leads_list data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadLeadslistListData(customQueryStr, setters) {

    const gftLeadslist = MosyFilterEngine('leads_list', true);
    let finalFilterStr = btoa(gftLeadslist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setLeadslistLoading(true);
    
    const leadslistListData = await getLeadslistListData(finalFilterStr);
    
    setters.setLeadslistLoading(false)
    setters.setLeadslistListData(leadslistListData?.data)

    setters.setLeadslistListPageCount(leadslistListData?.page_count)


    return leadslistListData

}
  
  
export async function leadslistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const leadslistTokenId = mosyUrlParam('leads_list_uptoken');
    
    const deleteParam = mosyUrlParam('leads_list_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedLeadslistToken = '0';
    if (leadslistTokenId) {
      
      decodedLeadslistToken = atob(leadslistTokenId); // Decode the record_id
      setters.setLeadslistUptoken(leadslistTokenId);
      setters.setLeadslistActionStatus('update_leads_list');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawLeadslistQueryStr =`where primkey ='${decodedLeadslistToken}'`
    if(customQueryStr!='')
    {
      // if no leads_list_uptoken set , use customQueryStr
      if (!leadslistTokenId) {
       rawLeadslistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initLeadslistProfileData(rawLeadslistQueryStr)

    if(deleteParam){
      popDeleteDialog(leadslistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setLeadslistNode(finalProfileData)
    
    
}
  
  

export function InteprateLeadslistEvent(data) {
     
  //console.log('🎯 Leadslist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_leads_list){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLeadslistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('leads_list_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_leads_list){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add leads_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_leads_list){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update leads_list `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_leads_list){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../leads_list/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteLeadslist(deleteToken).then(data=>{
  
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
       deleteUrlParam('leads_list_delete');
        
    }
  
  });

}