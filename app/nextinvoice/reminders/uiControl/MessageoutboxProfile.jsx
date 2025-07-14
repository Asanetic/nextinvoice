'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam, mosyGetElemVal  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateMessageoutboxFormAction, messageoutboxProfileData , popDeleteDialog, InteprateMessageoutboxEvent } from '../dataControl/MessageoutboxRequestHandler';

//state management
import { useMessageoutboxState } from '../dataControl/MessageoutboxStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton
} from '../../UiControl/componentControl';

//nextinvoice custom functions
import { sendMessage , loadDocMessage, grabMessage , sendWhatsappMessage, PlaceHolderButtons } from '../../nextinvoice_custom_functions';

import  MessageoutboxList from './MessageoutboxList';

import { MosyLiveSearch } from '../../UiControl/customUI';

// export profile

export default function MessageoutboxProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    docData ={},
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="MessageoutboxMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Messageoutbox states
  const [stateItem, stateItemSetters] = useMessageoutboxState(settersOverrides);
  const messagingNode = stateItem.messageoutboxNode
  
  // -- basic states --//
  const paramMessageoutboxUptoken  = stateItem.messageoutboxUptoken
  const messageoutboxActionStatus = stateItem.messageoutboxActionStatus
  const snackMessage = stateItem.snackMessage

  const invoiceDataSet = stateItem.invoiceDataSet

  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setMessageoutboxNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postMessageoutboxFormData(e) {
    
    handleInputChange('txt_message_details', loadDocMessage(invoiceDataSet));

    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateMessageoutboxFormAction(e, stateItemSetters).then(response=>{
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postMessageoutboxFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("MessageoutboxProfileTray")
      closeMosyModal()
      
    })
    
  }

  useEffect(() => {
    stateItemSetters.setInvoiceDataSet(docData);

    const fetchData = async () => {
      await messageoutboxProfileData(customQueryStr, stateItemSetters, router, customProfileData);
      
      
      mosyScrollTo("MessageoutboxProfileTray");
      
      if (docData && Object.keys(docData).length > 0) {

        handleInputChange('txt_message_details', loadDocMessage(docData));
        handleInputChange('txt_receiver_contacts', `${docData?.client_tel || ""} / ${docData?.client_email || ""}`);
        handleInputChange('txt_receiver_tel', `${docData?.client_tel || ""}`);
        handleInputChange('txt_receiver_email', `${docData?.client_email}`);

        handleInputChange('txt__invoices_invoice_no_ref_number', `${docData?.invoice_no || ""}`);
        handleInputChange('txt_ref_number', `${docData?.invoice_id || ""}`);
        handleInputChange('txt_subject', `Hello ${docData?._clients_client_name_client_id || ""} here is your ${docData?.invoice_type || ""} ${docData?.invoice_no || ""}` );      
        
      }

     // console.log(`loadDocMessage`, docData, ", ieneoirneorn",invoiceDataSet)
    };
  
    fetchData(); // Call the async function
  
  }, [localEventSignature]);  
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="MessageoutboxProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postMessageoutboxFormData} encType="multipart/form-data" id="messaging_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {messagingNode?.primkey ? (  <span> Message details</span> ) :(<span> New message </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramMessageoutboxUptoken && (
                  <DeleteButton
                  src="MessageoutboxMainProfilePage"
                  tableName="messaging"
                  uptoken={paramMessageoutboxUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && ( <Link href="./messages" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramMessageoutboxUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Send"
                  icon="send"
                  onClick={()=>{
                    sendMessage()
                    handleInputChange('txt_message_details', loadDocMessage(invoiceDataSet));
                  }}
                  />
                  
                  <MosyActionButton
                  label=" Copy"
                  icon="copy"
                  onClick={()=>{

                    grabMessage('txt_message_details')
                    handleInputChange('txt_message_details', loadDocMessage(invoiceDataSet));

                  }}
                  />
                  
                  <MosyActionButton
                  label=" Whatsapp"
                  icon="whatsapp"
                  onClick={()=>{
                    sendWhatsappMessage()
                    handleInputChange('txt_message_details', loadDocMessage(invoiceDataSet));
                  }}
                  />
                  
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
                  
                </>
              )}
              
              {paramMessageoutboxUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="MessageoutboxMainProfilePage"
                tableName="messaging"
                uptoken={paramMessageoutboxUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="MessageoutboxMainProfilePage"
                tableName="messaging"
                link="./message"
                label="New message "
                icon="edit" />
              </>
            )}
            
          </div>
        </div></>
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
                  onSelectFull={(dataRes) =>
                  {
                    handleInputChange('txt_message_details', loadDocMessage(dataRes));
                    handleInputChange('txt_receiver_contacts', `${dataRes?.client_tel} / ${dataRes?.client_email}`);
                    handleInputChange('txt_receiver_tel', `${dataRes?.client_tel}`);
                    handleInputChange('txt_receiver_email', `${dataRes?.client_email}`);

                    stateItemSetters.setInvoiceDataSet(dataRes)
                  }}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-4 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="messaging"
                  field="receiver_tel"
                  label="Receiver Tel"
                  value={messagingNode?.receiver_tel || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="messaging"
                  field="receiver_email"
                  label="Receiver Email"
                  value={messagingNode?.receiver_email || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="messaging"
                  field="subject"
                  label="Subject"
                  value={messagingNode?.subject || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="title"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                  <PlaceHolderButtons textareaId="txt_message_details" insertAfterId="label_messaging_txt_message_details"/>
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
                  
                  
                  <input className="form-control" id="txt_receiver_contacts" name="txt_receiver_contacts" value={messagingNode?.receiver_contacts || ""} placeholder="Receiver Contacts" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_reciver_names" name="txt_reciver_names" value={messagingNode?.reciver_names || ""} placeholder="Reciver Names" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_message_date" name="txt_message_date" value={messagingNode?.message_date || ""} placeholder="Message Date" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_sent_state" name="txt_sent_state" value={messagingNode?.sent_state || ""} placeholder="Sent State" type="hidden"/>
                  
                  
                  <input className="form-control" id="txt_custom_dictionary" name="txt_custom_dictionary" value={messagingNode?.custom_dictionary || ""} placeholder="Custom Dictionary" type="hidden"/>
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="MessageoutboxMainProfilePage"
                  tblName="messaging"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="messaging_uptoken" name="messaging_uptoken" value={paramMessageoutboxUptoken}/>
              <input type="hidden" id="messaging_mosy_action" name="messaging_mosy_action" value={messageoutboxActionStatus}/>
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
            
            <MessageoutboxList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : btoa(`where ref_number ='${messagingNode?.ref_number}' `),
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateMessageoutboxEvent,
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

