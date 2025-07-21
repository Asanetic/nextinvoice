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
export async function insertProductandservices() {
 //console.log(`Form inventory insert sent `)

  return await mosyPostFormData({
    formId: 'inventory_profile_form',
    url: '/api/nextinvoice/pns/productandservices',
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateProductandservices() {

  //console.log(`Form inventory update sent `)

  return await mosyPostFormData({
    formId: 'inventory_profile_form',
    url: '/api/nextinvoice/pns/productandservices',
    method: 'POST',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateProductandservicesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('inventory_mosy_action');
 
 //console.log(`Form inventory submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_inventory') {

      actionMessage ='Record added succesfully!';

      result = await insertProductandservices();
    }

    if (actionType === 'update_inventory') {

      actionMessage ='Record updated succesfully!';

      result = await updateProductandservices();
    }

    if (result?.status === 'success') {
      
      const inventoryUptoken = btoa(result.inventory_uptoken || '');

      //set id key
      setters.setProductandservicesUptoken(inventoryUptoken);
      
      //update url with new inventoryUptoken
      mosyUpdateUrlParam('inventory_uptoken', inventoryUptoken)

      setters.setProductandservicesActionStatus('update_inventory')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: inventoryUptoken,
        actionName : actionType,
        actionType : 'inventory_form_submission'
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


export async function initProductandservicesProfileData(rawQstr) {

  //add the following data in response
  const rawMutations = {
     
  }
  

  MosyNotify({message : 'Refreshing Product and Services' , icon:'refresh', addTimer:false})

  const encodedMutations = btoa(JSON.stringify(rawMutations));

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/pns/productandservices',
      params: { 
      q: btoa(rawQstr),         
      mutations: encodedMutations,
      fullQ : true,
      aw : btoa(``),
      src : btoa(`initProductandservicesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('pns Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching pns data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteProductandservices(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: '/api/nextinvoice/pns/delete',
        params: { 
          _inventory_delete_record: (token), 
          },
      });

      console.log('Token DeleteProductandservices '+token)
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


export async function getProductandservicesListData(qstr = "") {
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
  const pageNo = mosyUrlParam('qinventory_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: '/api/nextinvoice/pns/productandservices',
      params: { 
        q: qstr, 
        mutations: encodedMutations,
        fullQ : fullWhere,
        pagination : `l:qinventory_page:${recordsPerPage}:${pageNo}`,
        aw : btoa(`order by primkey desc`),
        src : btoa(`getProductandservicesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('pns Data:', response.data);
      return response; // ✅ Return the data
    } else {
      console.log('Error fetching pns data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadProductandservicesListData(customQueryStr, setters) {

    const gftProductandservices = MosyFilterEngine('inventory', true);
    let finalFilterStr = btoa(gftProductandservices);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setProductandservicesLoading(true);
    
    const productandservicesListData = await getProductandservicesListData(finalFilterStr);
    
    setters.setProductandservicesLoading(false)
    setters.setProductandservicesListData(productandservicesListData?.data)

    setters.setProductandservicesListPageCount(productandservicesListData?.page_count)


    return productandservicesListData

}
  
  
export async function productandservicesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const productandservicesTokenId = mosyUrlParam('inventory_uptoken');
    
    const deleteParam = mosyUrlParam('inventory_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedProductandservicesToken = '0';
    if (productandservicesTokenId) {
      
      decodedProductandservicesToken = atob(productandservicesTokenId); // Decode the record_id
      setters.setProductandservicesUptoken(productandservicesTokenId);
      setters.setProductandservicesActionStatus('update_inventory');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawProductandservicesQueryStr =`where primkey ='${decodedProductandservicesToken}'`
    if(customQueryStr!='')
    {
      // if no inventory_uptoken set , use customQueryStr
      if (!productandservicesTokenId) {
       rawProductandservicesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initProductandservicesProfileData(rawProductandservicesQueryStr)

    if(deleteParam){
      popDeleteDialog(productandservicesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setProductandservicesNode(finalProfileData)
    
    
}
  
  

export function InteprateProductandservicesEvent(data) {
     
  //console.log('🎯 Productandservices Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_inventory){

    if(data?.profile)
    {
      const router = data?.router
      
      const url = data?.url

      router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setProductandservicesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProductandservicesProfileTray')

    
    mosyUpdateUrlParam('inventory_uptoken', btoa(data?.token))
    
    }
  }

  if(childActionName.add_inventory){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add inventory `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProductandservicesProfileTray')
      }
    }
     
  }

  if(childActionName.update_inventory){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update inventory `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProductandservicesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_inventory){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../pns/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteProductandservices(deleteToken).then(data=>{
  
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
       deleteUrlParam('inventory_delete');
        
    }
  
  });

}