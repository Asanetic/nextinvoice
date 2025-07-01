'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateSmsremindersFormAction, smsremindersProfileData , popDeleteDialog, InteprateSmsremindersEvent } from '../dataControl/SmsremindersRequestHandler';

//state management
import { useSmsremindersState } from '../dataControl/SmsremindersStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
} from '../../UiControl/componentControl';

//nextinvoice custom functions
import { sendMessage } from '../../nextinvoice_custom_functions';

import  SmsremindersList from './SmsremindersList';

import { MosyLiveSearch } from '../../UiControl/customUI';

// export profile

export default function SmsremindersProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SmsremindersMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Smsreminders states
  const [stateItem, stateItemSetters] = useSmsremindersState(settersOverrides);
  const messagingNode = stateItem.smsremindersNode
  
  // -- basic states --//
  const paramSmsremindersUptoken  = stateItem.smsremindersUptoken
  const smsremindersActionStatus = stateItem.smsremindersActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSmsremindersNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSmsremindersFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSmsremindersFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSmsremindersFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("SmsremindersProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    smsremindersProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("SmsremindersProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SmsremindersProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSmsremindersFormData} encType="multipart/form-data" id="messaging_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {messagingNode?.primkey ? (  <span> Message details</span> ) :(<span> New message </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramSmsremindersUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramSmsremindersUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
                  >
                  <i className='fa fa-trash'></i> Delete
                </button>)}
                
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <>{showNavigationIsle && (<div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                <Link href="./smslist" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                {paramSmsremindersUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Load templates"
                  icon="file-text"
                  onClick={()=>{
                    MosyLiveSearch({
                      api:'/api/nextinvoice/messagetemplates/messagetemplates',
                      displayField:'template_name',
                      tableName:'message_templates',
                      actionName : 'loadTemplate',
                      title:' Search templates',
                      actionData : {stateSetters : stateItemSetters},
                      onSelectFull : (dataRes) => {
                        
                        handleInputChange('txt_message_details', dataRes?.message_template)
                        closeMosyModal()
                        
                      },
                      
                    })
                    
                  }}
                  />
                  
                  <MosyActionButton
                  label=" Send message"
                  icon="send"
                  onClick={()=>{sendMessage()}}
                  />
                  
                </>
              )}
              
              
              {paramSmsremindersUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramSmsremindersUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramSmsremindersUptoken && (
                
                <AddNewButton link="./sms" label="New message " icon="edit" />
                
              )}
              
            </div>
          </div>)}</>
          <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
          {/*    Navigation isle      */}
          <div className="row justify-content-center m-0 p-0 col-md-12" id="">
            {/*    Image section isle      */}
            
            {/*    Image section isle      */}
            
            {/*  //-------------    main content starts here  ------------------------------ */}
            
            
            
            <div className="col-md-12 row justify-content-center m-0  p-0">
              {/*    Input cells section isle      */}
              <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                <div className="col-md-12 row justify-content-center p-0 m-0">
                  <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                    <LiveSearchDropdown
                    apiEndpoint="/api/nextinvoice/docs/invoicelist"
                    tblName="invoices"
                    parentTable="messaging"
                    inputName="txt__invoices_invoice_no_ref_number"
                    hiddenInputName="txt_ref_number"
                    valueField="invoice_no"
                    displayField="invoice_no"
                    label="Document no"
                    defaultValue={{ invoice_no: messagingNode?.ref_number || "", invoice_no: messagingNode?._invoices_invoice_no_ref_number || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) => handleInputChange('txt_message_details', loadDocMessage(dataRes))}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-4 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="messaging"
                    field="subject"
                    label="Subject"
                    value={messagingNode?.subject || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="messaging"
                    field="receiver_contacts"
                    label="Receiver Contacts"
                    value={messagingNode?.receiver_contacts || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="messaging"
                    field="message_details"
                    label="Message Details"
                    value={messagingNode?.message_details || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                    
                    <input className="form-control" id="txt_reciver_names" name="txt_reciver_names" value={messagingNode?.reciver_names || ""} placeholder="Reciver Names" type="hidden"/>
                    
                    
                    <input className="form-control" id="txt_message_date" name="txt_message_date" value={messagingNode?.message_date || ""} placeholder="Message Date" type="hidden"/>
                    
                    
                    <input className="form-control" id="txt_sent_state" name="txt_sent_state" value={messagingNode?.sent_state || ""} placeholder="Sent State" type="hidden"/>
                    
                    
                    <input className="form-control" id="txt_custom_dictionary" name="txt_custom_dictionary" value={messagingNode?.custom_dictionary || ""} placeholder="Custom Dictionary" type="hidden"/>
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="messaging" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="messaging_uptoken" name="messaging_uptoken" value={paramSmsremindersUptoken}/>
                <input type="hidden" id="messaging_mosy_action" name="messaging_mosy_action" value={smsremindersActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            
            
            <style jsx global>{`
            .data_list_section {
              display: none;
            }
            .bottom_tbl_handler{
              padding-bottom:70px!important;
            }
            `}
          </style>
          {messagingNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`More ${messagingNode?._invoices_invoice_no_ref_number} messages`} </h5>
              
              <div className="col-md-12 p-2 text-right ">
                <a href={`./smslist?messaging_mosyfilter=${btoa(`ref_number ='${messagingNode?.ref_number}' `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
              </div>
              
              <SmsremindersList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : btoa(`where ref_number ='${messagingNode?.ref_number}' `),
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateSmsremindersEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
              }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
    
    
    {/* snack notifications -- */}
    {snackMessage &&(
      <MosySnackWidget
      content={snackMessage}
      duration={5000}
      type="custom"
      onDone={() => {
        stateItemSetters.setSnackMessage("");
        stateItem.snackOnDone(); // Run whats inside onDone
        deleteUrlParam("snack_alert")
      }}
      
      />)}
      {/* snack notifications -- */}
      
      
      {/* ================== End Feature Section========================== ------*/}
    </div>
    
  );
  
}

