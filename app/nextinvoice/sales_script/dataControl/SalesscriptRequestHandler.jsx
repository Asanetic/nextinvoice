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
export async function insertSalesscript() {
 //console.log(`Form sales_script insert sent `)

  return await mosyPostFormData({
    formId: 'sales_script_profile_form',
    url: '/api/nextinvoice/sales_script/salesscript',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateSalesscript() {

  //console.log(`Form sales_script update sent `)

  return await mosyPostFormData({
    formId: 'sales_script_profile_form',
    url: '/api/nextinvoice/sales_script/salesscript',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateSalesscriptFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('sales_script_mosy_action');
 
 //console.log(`Form sales_script submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_sales_script') {

      actionMessage ='Record added succesfully!';

      result = await insertSalesscript();
    }

    if (actionType === 'update_sales_script') {

      actionMessage ='Record updated succesfully!';

      result = await updateSalesscript();
    }

    if (result?.status === 'success') {
      
      const sales_scriptUptoken = btoa(result.sales_script_uptoken || '');

      //set id key
      setters.setSalesscriptUptoken(sales_scriptUptoken);
      
      //update url with new sales_scriptUptoken
      mosyUpdateUrlParam('sales_script_uptoken', sales_scriptUptoken)

      setters.setSalesscriptActionStatus('update_sales_script')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: sales_scriptUptoken,
        actionName : actionType,
        actionType : 'sales_script_form_submission'
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


export async function initSalesscriptProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Sales Script' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/sales_script/salesscript',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initSalesscriptProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('sales_script Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching sales_script data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSalesscript(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/sales_script/delete',
        params: { 
          _sales_script_delete_record: (token), 
          },
      });

      console.log('Token DeleteSalesscript '+token)
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


export async function getSalesscriptListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qsales_script_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/sales_script/salesscript',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qsales_script_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getSalesscriptListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('sales_script Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching sales_script data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSalesscriptListData(customQueryStr, setters) {

    const gftSalesscript = MosyFilterEngine('sales_script', true);
    let finalFilterStr = btoa(gftSalesscript);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSalesscriptLoading(true);
    
    const salesscriptListData = await getSalesscriptListData(finalFilterStr);
    
    setters.setSalesscriptLoading(false)
    setters.setSalesscriptListData(salesscriptListData?.data)

    setters.setSalesscriptListPageCount(salesscriptListData?.page_count)


    return salesscriptListData

}
  
  
export async function salesscriptProfileData(customQueryStr, setters, router, customProfileData={}) {

    const salesscriptTokenId = mosyUrlParam('sales_script_uptoken');
    
    const deleteParam = mosyUrlParam('sales_script_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSalesscriptToken = '0';
    if (salesscriptTokenId) {
      
      decodedSalesscriptToken = atob(salesscriptTokenId); // Decode the record_id
      setters.setSalesscriptUptoken(salesscriptTokenId);
      setters.setSalesscriptActionStatus('update_sales_script');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSalesscriptQueryStr =`where primkey ='${decodedSalesscriptToken}'`
    if(customQueryStr!='')
    {
      // if no sales_script_uptoken set , use customQueryStr
      if (!salesscriptTokenId) {
       rawSalesscriptQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSalesscriptProfileData(rawSalesscriptQueryStr)

    if(deleteParam){
      popDeleteDialog(salesscriptTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSalesscriptNode(finalProfileData)
    
    
}
  
  

export function InteprateSalesscriptEvent(data) {
     
  //console.log('🎯 Salesscript Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_sales_script){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSalesscriptCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SalesscriptProfileTray')

    
    mosyUpdateUrlParam('sales_script_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_sales_script){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add sales_script `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SalesscriptProfileTray')
      }
    }
     
  }

  if(childActionName.update_sales_script){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update sales_script `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SalesscriptProfileTray')
        
      }
    }
  }

  if(childActionName.delete_sales_script){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../sales_script/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSalesscript(deleteToken).then(data=>{
  
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
       deleteUrlParam('sales_script_delete');
        
    }
  
  });

}