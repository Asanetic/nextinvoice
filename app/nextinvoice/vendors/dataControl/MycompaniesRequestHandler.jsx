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
export async function insertMycompanies() {
 //console.log(`Form companies insert sent `)

  return await mosyPostFormData({
    formId: 'companies_profile_form',
    url: '/api/nextinvoice/vendors/mycompanies',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateMycompanies() {

  //console.log(`Form companies update sent `)

  return await mosyPostFormData({
    formId: 'companies_profile_form',
    url: '/api/nextinvoice/vendors/mycompanies',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateMycompaniesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('companies_mosy_action');
 
 //console.log(`Form companies submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_companies') {

      actionMessage ='Record added succesfully!';

      result = await insertMycompanies();
    }

    if (actionType === 'update_companies') {

      actionMessage ='Record updated succesfully!';

      result = await updateMycompanies();
    }

    if (result?.status === 'success') {
      
      const companiesUptoken = btoa(result.companies_uptoken || '');

      //set id key
      setters.setMycompaniesUptoken(companiesUptoken);
      
      //update url with new companiesUptoken
      mosyUpdateUrlParam('companies_uptoken', companiesUptoken)

      setters.setMycompaniesActionStatus('update_companies')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: companiesUptoken,
        actionName : actionType,
        actionType : 'companies_form_submission'
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


export async function initMycompaniesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing My companies' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/vendors/mycompanies',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initMycompaniesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('vendors Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching vendors data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteMycompanies(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/vendors/delete',
        params: { 
          _companies_delete_record: (token), 
          },
      });

      console.log('Token DeleteMycompanies '+token)
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


export async function getMycompaniesListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qcompanies_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/vendors/mycompanies',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qcompanies_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getMycompaniesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('vendors Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching vendors data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadMycompaniesListData(customQueryStr, setters) {

    const gftMycompanies = MosyFilterEngine('companies', true);
    let finalFilterStr = btoa(gftMycompanies);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setMycompaniesLoading(true);
    
    const mycompaniesListData = await getMycompaniesListData(finalFilterStr);
    
    setters.setMycompaniesLoading(false)
    setters.setMycompaniesListData(mycompaniesListData?.data)

    setters.setMycompaniesListPageCount(mycompaniesListData?.page_count)


    return mycompaniesListData

}
  
  
export async function mycompaniesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const mycompaniesTokenId = mosyUrlParam('companies_uptoken');
    
    const deleteParam = mosyUrlParam('companies_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedMycompaniesToken = '0';
    if (mycompaniesTokenId) {
      
      decodedMycompaniesToken = atob(mycompaniesTokenId); // Decode the record_id
      setters.setMycompaniesUptoken(mycompaniesTokenId);
      setters.setMycompaniesActionStatus('update_companies');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawMycompaniesQueryStr =`where primkey ='${decodedMycompaniesToken}'`
    if(customQueryStr!='')
    {
      // if no companies_uptoken set , use customQueryStr
      if (!mycompaniesTokenId) {
       rawMycompaniesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initMycompaniesProfileData(rawMycompaniesQueryStr)

    if(deleteParam){
      popDeleteDialog(mycompaniesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setMycompaniesNode(finalProfileData)
    
    
}
  
  

export function InteprateMycompaniesEvent(data) {
     
  //console.log('🎯 Mycompanies Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_companies){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setMycompaniesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('companies_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_companies){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add companies `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_companies){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update companies `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_companies){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../vendors/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteMycompanies(deleteToken).then(data=>{
  
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
       deleteUrlParam('companies_delete');
        
    }
  
  });

}