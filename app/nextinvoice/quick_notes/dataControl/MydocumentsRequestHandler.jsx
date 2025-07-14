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
export async function insertMydocuments() {
 //console.log(`Form quick_notes insert sent `)

  return await mosyPostFormData({
    formId: 'quick_notes_profile_form',
    url: '/api/nextinvoice/quick_notes/mydocuments',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateMydocuments() {

  //console.log(`Form quick_notes update sent `)

  return await mosyPostFormData({
    formId: 'quick_notes_profile_form',
    url: '/api/nextinvoice/quick_notes/mydocuments',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateMydocumentsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('quick_notes_mosy_action');
 
 //console.log(`Form quick_notes submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_quick_notes') {

      actionMessage ='Record added succesfully!';

      result = await insertMydocuments();
    }

    if (actionType === 'update_quick_notes') {

      actionMessage ='Record updated succesfully!';

      result = await updateMydocuments();
    }

    if (result?.status === 'success') {
      
      const quick_notesUptoken = btoa(result.quick_notes_uptoken || '');

      //set id key
      setters.setMydocumentsUptoken(quick_notesUptoken);
      
      //update url with new quick_notesUptoken
      mosyUpdateUrlParam('quick_notes_uptoken', quick_notesUptoken)

      setters.setMydocumentsActionStatus('update_quick_notes')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: quick_notesUptoken,
        actionName : actionType,
        actionType : 'quick_notes_form_submission'
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


export async function initMydocumentsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing My documents' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/quick_notes/mydocuments',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initMydocumentsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('quick_notes Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching quick_notes data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteMydocuments(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/quick_notes/delete',
        params: { 
          _quick_notes_delete_record: (token), 
          },
      });

      console.log('Token DeleteMydocuments '+token)
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


export async function getMydocumentsListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qquick_notes_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/quick_notes/mydocuments',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qquick_notes_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getMydocumentsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('quick_notes Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching quick_notes data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadMydocumentsListData(customQueryStr, setters) {

    const gftMydocuments = MosyFilterEngine('quick_notes', true);
    let finalFilterStr = btoa(gftMydocuments);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setMydocumentsLoading(true);
    
    const mydocumentsListData = await getMydocumentsListData(finalFilterStr);
    
    setters.setMydocumentsLoading(false)
    setters.setMydocumentsListData(mydocumentsListData?.data)

    setters.setMydocumentsListPageCount(mydocumentsListData?.page_count)


    return mydocumentsListData

}
  
  
export async function mydocumentsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const mydocumentsTokenId = mosyUrlParam('quick_notes_uptoken');
    
    const deleteParam = mosyUrlParam('quick_notes_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedMydocumentsToken = '0';
    if (mydocumentsTokenId) {
      
      decodedMydocumentsToken = atob(mydocumentsTokenId); // Decode the record_id
      setters.setMydocumentsUptoken(mydocumentsTokenId);
      setters.setMydocumentsActionStatus('update_quick_notes');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawMydocumentsQueryStr =`where primkey ='${decodedMydocumentsToken}'`
    if(customQueryStr!='')
    {
      // if no quick_notes_uptoken set , use customQueryStr
      if (!mydocumentsTokenId) {
       rawMydocumentsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initMydocumentsProfileData(rawMydocumentsQueryStr)

    if(deleteParam){
      popDeleteDialog(mydocumentsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setMydocumentsNode(finalProfileData)
    
    
}
  
  

export function InteprateMydocumentsEvent(data) {
     
  //console.log('🎯 Mydocuments Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_quick_notes){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setMydocumentsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('quick_notes_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_quick_notes){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add quick_notes `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_quick_notes){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update quick_notes `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_quick_notes){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../quick_notes/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteMydocuments(deleteToken).then(data=>{
  
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
       deleteUrlParam('quick_notes_delete');
        
    }
  
  });

}