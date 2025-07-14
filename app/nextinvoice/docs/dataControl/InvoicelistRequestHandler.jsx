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
export async function insertInvoicelist() {
 //console.log(`Form invoices insert sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: '/api/nextinvoice/docs/invoicelist',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateInvoicelist() {

  //console.log(`Form invoices update sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: '/api/nextinvoice/docs/invoicelist',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateInvoicelistFormAction(e, setters) {
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

      result = await insertInvoicelist();
    }

    if (actionType === 'update_invoices') {

      actionMessage ='Record updated succesfully!';

      result = await updateInvoicelist();
    }

    if (result?.status === 'success') {
      
      const invoicesUptoken = btoa(result.invoices_uptoken || '');

      //set id key
      setters.setInvoicelistUptoken(invoicesUptoken);
      
      //update url with new invoicesUptoken
      mosyUpdateUrlParam('invoices_uptoken', invoicesUptoken)

      setters.setInvoicelistActionStatus('update_invoices')
    
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


export async function initInvoicelistProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],
    
    subtotal : [],
    
    grand_total : [],
    
    amount_paid : [],
    
    invoice_balance : [],
          
    _companies_business_name_vendor_name : [],

  }
  

  MosyNotify({message : 'Refreshing Invoice list' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docs/invoicelist',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initInvoicelistProfileData`)
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


export async function DeleteInvoicelist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/docs/delete',
        params: { 
          _invoices_delete_record: (token), 
          },
      });

      console.log('Token DeleteInvoicelist '+token)
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


export async function getInvoicelistListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _clients_client_name_client_id : [],
    
    subtotal : [],
    
    grand_total : [],
    
    amount_paid : [],
    
    invoice_balance : [],
          
    _companies_business_name_vendor_name : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qinvoices_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docs/invoicelist',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qinvoices_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getInvoicelistListData`)
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


export async function loadInvoicelistListData(customQueryStr, setters) {

    const gftInvoicelist = MosyFilterEngine('invoices', true);
    let finalFilterStr = btoa(gftInvoicelist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setInvoicelistLoading(true);
    
    const invoicelistListData = await getInvoicelistListData(finalFilterStr);
    
    setters.setInvoicelistLoading(false)
    setters.setInvoicelistListData(invoicelistListData?.data)

    setters.setInvoicelistListPageCount(invoicelistListData?.page_count)


    return invoicelistListData

}
  
  
export async function invoicelistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const invoicelistTokenId = mosyUrlParam('invoices_uptoken');
    
    const deleteParam = mosyUrlParam('invoices_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedInvoicelistToken = '0';
    if (invoicelistTokenId) {
      
      decodedInvoicelistToken = atob(invoicelistTokenId); // Decode the record_id
      setters.setInvoicelistUptoken(invoicelistTokenId);
      setters.setInvoicelistActionStatus('update_invoices');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawInvoicelistQueryStr =`where primkey ='${decodedInvoicelistToken}'`
    if(customQueryStr!='')
    {
      // if no invoices_uptoken set , use customQueryStr
      if (!invoicelistTokenId) {
       rawInvoicelistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initInvoicelistProfileData(rawInvoicelistQueryStr)

    if(deleteParam){
      popDeleteDialog(invoicelistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setInvoicelistNode(finalProfileData)
    
    
}
  
  

export function InteprateInvoicelistEvent(data) {
     
  //console.log('🎯 Invoicelist Child gave us:', data);

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

    parentSetter?.setInvoicelistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('invoices_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_invoices){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add invoices `, data?.setters)

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

    //console.log(`update invoices `, data?.setters)

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

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../docs/invoices')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteInvoicelist(deleteToken).then(data=>{
  
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