'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

//routes manager
///handle routes 
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

//insert data
export async function insertSystemsettings() {
 //console.log(`Form account_urls insert sent `)

  return await mosyPostFormData({
    formId: 'account_urls_profile_form',
    url: apiRoutes.systemsettings.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSystemsettings() {

  //console.log(`Form account_urls update sent `)

  return await mosyPostFormData({
    formId: 'account_urls_profile_form',
    url: apiRoutes.systemsettings.base,
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSystemsettingsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('account_urls_mosy_action');
 
 //console.log(`Form account_urls submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_account_urls') {

      actionMessage ='Record added succesfully!';

      result = await insertSystemsettings();
    }

    if (actionType === 'update_account_urls') {

      actionMessage ='Record updated succesfully!';

      result = await updateSystemsettings();
    }

    if (result?.status === 'success') {
      
      const account_urlsUptoken = btoa(result.account_urls_uptoken || '');

      //set id key
      setters.setSystemsettingsUptoken(account_urlsUptoken);
      
      //update url with new account_urlsUptoken
      mosyUpdateUrlParam('account_urls_uptoken', account_urlsUptoken)

      setters.setSystemsettingsActionStatus('update_account_urls')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: account_urlsUptoken,
        actionName : actionType,
        actionType : 'account_urls_form_submission'
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


export async function initSystemsettingsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing System settings' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.systemsettings.base,
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSystemsettingsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('sysconfigs Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching sysconfigs data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSystemsettings(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.systemsettings.delete,
        params: { 
          _account_urls_delete_record: (token), 
          },
      });

      console.log('Token DeleteSystemsettings '+token)
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


export async function getSystemsettingsListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qaccount_urls_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.systemsettings.base,
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qaccount_urls_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSystemsettingsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('sysconfigs Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching sysconfigs data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSystemsettingsListData(customQueryStr, setters) {

    const gftSystemsettings = MosyFilterEngine('account_urls', true);
    let finalFilterStr = btoa(gftSystemsettings);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSystemsettingsLoading(true);
    
    const systemsettingsListData = await getSystemsettingsListData(finalFilterStr);
    
    setters.setSystemsettingsLoading(false)
    setters.setSystemsettingsListData(systemsettingsListData?.data)

    setters.setSystemsettingsListPageCount(systemsettingsListData?.page_count)


    return systemsettingsListData

}
  
  
export async function systemsettingsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const systemsettingsTokenId = mosyUrlParam('account_urls_uptoken');
    
    const deleteParam = mosyUrlParam('account_urls_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSystemsettingsToken = '0';
    if (systemsettingsTokenId) {
      
      decodedSystemsettingsToken = atob(systemsettingsTokenId); // Decode the record_id
      setters.setSystemsettingsUptoken(systemsettingsTokenId);
      setters.setSystemsettingsActionStatus('update_account_urls');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSystemsettingsQueryStr =`where primkey ='${decodedSystemsettingsToken}'`
    if(customQueryStr!='')
    {
      // if no account_urls_uptoken set , use customQueryStr
      if (!systemsettingsTokenId) {
       rawSystemsettingsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSystemsettingsProfileData(rawSystemsettingsQueryStr)

    if(deleteParam){
      popDeleteDialog(systemsettingsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSystemsettingsNode(finalProfileData)
    
    
}
  
  

export function InteprateSystemsettingsEvent(data) {
     
  //console.log('🎯 Systemsettings Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_account_urls){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSystemsettingsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SystemsettingsProfileTray')

    
    mosyUpdateUrlParam('account_urls_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_account_urls){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add account_urls `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemsettingsProfileTray')
      }
    }
     
  }

  if(childActionName.update_account_urls){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update account_urls `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemsettingsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_account_urls){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../sysconfigs/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSystemsettings(deleteToken).then(data=>{
  
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
       deleteUrlParam('account_urls_delete');
        
    }
  
  });

}