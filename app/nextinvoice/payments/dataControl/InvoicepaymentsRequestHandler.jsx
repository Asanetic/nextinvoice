'use client';

//data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//components
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//generate data filter 
import { MosyFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

export async function insertInvoicepayments() {
 //console.log(`Form invoice_payments insert sent `)

  return await mosyPostFormData({
    formId: 'invoice_payments_profile_form',
    url: '/api/nextinvoice/payments/invoicepayments',
    method: 'POST',
    isMultipart: true,
  });
}

export async function updateInvoicepayments() {

  //console.log(`Form invoice_payments update sent `)

  return await mosyPostFormData({
    formId: 'invoice_payments_profile_form',
    url: '/api/nextinvoice/payments/invoicepayments',
    method: 'POST',
    isMultipart: true,
  });
}


 
export async function inteprateInvoicepaymentsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('invoice_payments_mosy_action');
 
 //console.log(`Form invoice_payments submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_invoice_payments') {

      actionMessage ='Record added succesfully!';

      result = await insertInvoicepayments();
    }

    if (actionType === 'update_invoice_payments') {

      actionMessage ='Record updated succesfully!';

      result = await updateInvoicepayments();
    }

    if (result?.status === 'success') {
      
      const invoice_paymentsUptoken = btoa(result.invoice_payments_uptoken || '');

      //set id key
      setters.setInvoicepaymentsUptoken(invoice_paymentsUptoken);
      
      //update url with new invoice_paymentsUptoken
      mosyUpdateUrlParam('invoice_payments_uptoken', invoice_paymentsUptoken)

      setters.setInvoicepaymentsActionStatus('update_invoice_payments')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: invoice_paymentsUptoken,
        actionName : actionType,
        actionType : 'invoice_payments_form_submission'
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


export async function initInvoicepaymentsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_invoice_id : [],
    
    invoice_key : [],

  }
  

  MosyNotify({message : 'Refreshing Invoice payments' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/payments/invoicepayments',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initInvoicepaymentsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('payments Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching payments data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteInvoicepayments(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/payments/delete',
        params: { 
          _invoice_payments_delete_record: (token), 
          },
      });

      console.log('Token DeleteInvoicepayments '+token)
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


export async function getInvoicepaymentsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa('')
  }
  
  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_invoice_id : [],
    
    invoice_key : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qinvoice_payments_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/payments/invoicepayments',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qinvoice_payments_page:${recordsPerPage}:${pageNo}`,
        aw:btoa(`order by primkey desc`),
        src : btoa(`getInvoicepaymentsListData`)        
        },
    });

    if (response.status === 'success') {
      //console.log('payments Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching payments data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadInvoicepaymentsListData(customQueryStr, setters) {

    const gftInvoicepayments = MosyFilterEngine('invoice_payments', true);
    let finalFilterStr = btoa(gftInvoicepayments);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setInvoicepaymentsLoading(true);
    
    const invoicepaymentsListData = await getInvoicepaymentsListData(finalFilterStr);
    
    setters.setInvoicepaymentsLoading(false)
    setters.setInvoicepaymentsListData(invoicepaymentsListData?.data)

    setters.setInvoicepaymentsListPageCount(invoicepaymentsListData?.page_count)


    return invoicepaymentsListData

}
  
  
export async function invoicepaymentsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const invoicepaymentsTokenId = mosyUrlParam('invoice_payments_uptoken');
    
    const deleteParam = mosyUrlParam('invoice_payments_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedInvoicepaymentsToken = '0';
    if (invoicepaymentsTokenId) {
      
      decodedInvoicepaymentsToken = atob(invoicepaymentsTokenId); // Decode the record_id
      setters.setInvoicepaymentsUptoken(invoicepaymentsTokenId);
      setters.setInvoicepaymentsActionStatus('update_invoice_payments');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawInvoicepaymentsQueryStr =`where primkey ='${decodedInvoicepaymentsToken}'`
    if(customQueryStr!='')
    {
      rawInvoicepaymentsQueryStr = customQueryStr
    }

    const profileDataRecord = await initInvoicepaymentsProfileData(rawInvoicepaymentsQueryStr)

    if(deleteParam){
      popDeleteDialog(invoicepaymentsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setInvoicepaymentsNode(finalProfileData)
    
    


}
  
  

export function InteprateInvoicepaymentsEvent(data) {
     
  //console.log('🎯 Invoicepayments Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_invoice_payments){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setInvoicepaymentsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    
    mosyUpdateUrlParam('invoice_payments_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_invoice_payments){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`add invoice_payments `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
     
  }

  if(childActionName.update_invoice_payments){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    console.log(`update invoice_payments `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
      }
    }
  }

  if(childActionName.delete_invoice_payments){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

 //pass the the data to custom functions
 customEventHandler(data)
  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../payments/list')
{     

  console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteInvoicepayments(deleteToken).then(data=>{
  
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
       deleteUrlParam('invoice_payments_delete');
        
    }
  
  });

}