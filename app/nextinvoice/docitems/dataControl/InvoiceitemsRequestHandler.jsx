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
export async function insertInvoiceitems() {
 //console.log(`Form invoice_items insert sent `)

  return await mosyPostFormData({
    formId: 'invoice_items_profile_form',
    url: '/api/nextinvoice/docitems/invoiceitems',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateInvoiceitems() {

  //console.log(`Form invoice_items update sent `)

  return await mosyPostFormData({
    formId: 'invoice_items_profile_form',
    url: '/api/nextinvoice/docitems/invoiceitems',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateInvoiceitemsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('invoice_items_mosy_action');
 
 //console.log(`Form invoice_items submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_invoice_items') {

      actionMessage ='Record added succesfully!';

      result = await insertInvoiceitems();
    }

    if (actionType === 'update_invoice_items') {

      actionMessage ='Record updated succesfully!';

      result = await updateInvoiceitems();
    }

    if (result?.status === 'success') {
      
      const invoice_itemsUptoken = btoa(result.invoice_items_uptoken || '');

      //set id key
      setters.setInvoiceitemsUptoken(invoice_itemsUptoken);
      
      //update url with new invoice_itemsUptoken
      mosyUpdateUrlParam('invoice_items_uptoken', invoice_itemsUptoken)

      setters.setInvoiceitemsActionStatus('update_invoice_items')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: invoice_itemsUptoken,
        actionName : actionType,
        actionType : 'invoice_items_form_submission'
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


export async function initInvoiceitemsProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_invoice_id : [],
          
    _inventory_item_name_item_id : [],
    
    totals : [],

  }
  

  MosyNotify({message : 'Refreshing Invoice items' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docitems/invoiceitems',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initInvoiceitemsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('docitems Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching docitems data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteInvoiceitems(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/docitems/delete',
        params: { 
          _invoice_items_delete_record: (token), 
          },
      });

      console.log('Token DeleteInvoiceitems '+token)
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


export async function getInvoiceitemsListData(qstr = "") {
   let fullWhere = true
  if(qstr=='')
  {
   fullWhere = false 
   qstr=btoa(``)
  }
  
  //add the following data in response
  const rawMutations = {
               
    _invoices_invoice_no_invoice_id : [],
          
    _inventory_item_name_item_id : [],
    
    totals : [],

  }
  
  const encodedMutations = btoa(JSON.stringify(rawMutations));

  //manage pagination 
  const pageNo = mosyUrlParam('qinvoice_items_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/docitems/invoiceitems',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qinvoice_items_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getInvoiceitemsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('docitems Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching docitems data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadInvoiceitemsListData(customQueryStr, setters) {

    const gftInvoiceitems = MosyFilterEngine('invoice_items', true);
    let finalFilterStr = btoa(gftInvoiceitems);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setInvoiceitemsLoading(true);
    
    const invoiceitemsListData = await getInvoiceitemsListData(finalFilterStr);
    
    setters.setInvoiceitemsLoading(false)
    setters.setInvoiceitemsListData(invoiceitemsListData?.data)

    setters.setInvoiceitemsListPageCount(invoiceitemsListData?.page_count)


    return invoiceitemsListData

}
  
  
export async function invoiceitemsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const invoiceitemsTokenId = mosyUrlParam('invoice_items_uptoken');
    
    const deleteParam = mosyUrlParam('invoice_items_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedInvoiceitemsToken = '0';
    if (invoiceitemsTokenId) {
      
      decodedInvoiceitemsToken = atob(invoiceitemsTokenId); // Decode the record_id
      setters.setInvoiceitemsUptoken(invoiceitemsTokenId);
      setters.setInvoiceitemsActionStatus('update_invoice_items');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawInvoiceitemsQueryStr =`where primkey ='${decodedInvoiceitemsToken}'`
    if(customQueryStr!='')
    {
      // if no invoice_items_uptoken set , use customQueryStr
      if (!invoiceitemsTokenId) {
       rawInvoiceitemsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initInvoiceitemsProfileData(rawInvoiceitemsQueryStr)

    if(deleteParam){
      popDeleteDialog(invoiceitemsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setInvoiceitemsNode(finalProfileData)
    
    
}
  
  

export function InteprateInvoiceitemsEvent(data) {
     
  //console.log('🎯 Invoiceitems Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_invoice_items){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setInvoiceitemsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('InvoiceitemsProfileTray')

    
    mosyUpdateUrlParam('invoice_items_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_invoice_items){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add invoice_items `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InvoiceitemsProfileTray')
      }
    }
     
  }

  if(childActionName.update_invoice_items){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update invoice_items `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InvoiceitemsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_invoice_items){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../docitems/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteInvoiceitems(deleteToken).then(data=>{
  
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
       deleteUrlParam('invoice_items_delete');
        
    }
  
  });

}