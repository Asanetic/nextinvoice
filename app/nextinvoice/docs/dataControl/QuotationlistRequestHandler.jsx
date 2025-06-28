'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertQuotationlist() {
 //console.log(`Form invoices insert sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: '/api/nextinvoice/docs/quotationlist',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateQuotationlist() {

  //console.log(`Form invoices update sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: '/api/nextinvoice/docs/quotationlist',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateQuotationlistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('invoices_mosy_action');
 
 //console.log(`Form invoices submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_invoices') {

      actionMessage ='Record added succesfully!';

      result = await insertQuotationlist();
    }

    if (actionType === 'update_invoices') {

      actionMessage ='Record updated succesfully!';

      result = await updateQuotationlist();
    }

    if (result?.status === 'success') {
      
      const invoicesUptoken = btoa(result.invoices_uptoken || '');

      //set id key
      setters.setQuotationlistUptoken(invoicesUptoken);
      
      //update url with new invoicesUptoken
      mosyUpdateUrlParam('invoices_uptoken', invoicesUptoken)

      setters.setQuotationlistActionStatus('update_invoices')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: invoicesUptoken,
        actionName : actionType,
        actionType : 'invoices_form_submission'
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


export async function initQuotationlistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],
          
    _companies_business_name_vendor_name : [],

  }
  

  MosyNotify({message : 'Refreshing Quotation list' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docs/quotationlist',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initQuotationlistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('docs Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching docs data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteQuotationlist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/docs/delete',
        params: { 
          _invoices_delete_record: (token), 
          },
      });

      console.log('Token DeleteQuotationlist '+token)
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


export async function getQuotationlistListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa('')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],
          
    _companies_business_name_vendor_name : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qinvoices_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docs/quotationlist',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qinvoices_page:${recordsPerPage}:${pageNo}`,
        aw:btoa(`order by primkey desc`),
        src : btoa(`getQuotationlistListData`)        
        },
    });

    if (response.status === 'success') {
      //console.log('docs Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching docs data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadQuotationlistListData(customQueryStr, setters) {

    const gftQuotationlist = MosyFilterEngine('invoices', true);
    let finalFilterStr = btoa(gftQuotationlist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setQuotationlistLoading(true);
    
    const quotationlistListData = await getQuotationlistListData(finalFilterStr);
    
    setters.setQuotationlistLoading(false)
    setters.setQuotationlistListData(quotationlistListData?.data)

    setters.setQuotationlistListPageCount(quotationlistListData?.page_count)


    return quotationlistListData

}
  
  
export async function quotationlistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const quotationlistTokenId = mosyUrlParam('invoices_uptoken');
    
    const deleteParam = mosyUrlParam('invoices_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedQuotationlistToken = '0';
    if (quotationlistTokenId) {
      
      decodedQuotationlistToken = atob(quotationlistTokenId); // Decode the record_id
      setters.setQuotationlistUptoken(quotationlistTokenId);
      setters.setQuotationlistActionStatus('update_invoices');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawQuotationlistQueryStr =`where primkey ='${decodedQuotationlistToken}'`
    if(customQueryStr!='')
    {
      rawQuotationlistQueryStr = customQueryStr
    }

    const profileDataRecord = await initQuotationlistProfileData(rawQuotationlistQueryStr)

    if(deleteParam){
      popDeleteDialog(quotationlistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setQuotationlistNode(finalProfileData)
    
    


}
  
  

export function InteprateQuotationlistEvent(data) {
     
  //console.log('🎯 Quotationlist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_invoices){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setQuotationlistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('invoices_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_invoices){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add invoices `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_invoices){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update invoices `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_invoices){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../docs/quotations')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteQuotationlist(deleteToken).then(data=>{
  
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
       deleteUrlParam('invoices_delete');
        
    }
  
  });

}