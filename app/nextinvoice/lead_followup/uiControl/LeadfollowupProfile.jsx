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
import { inteprateLeadfollowupFormAction, leadfollowupProfileData , popDeleteDialog, InteprateLeadfollowupEvent } from '../dataControl/LeadfollowupRequestHandler';

//state management
import { useLeadfollowupState } from '../dataControl/LeadfollowupStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
} from '../../UiControl/componentControl';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';
import { sendReminder } from '../../nextinvoice_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

import  LeadfollowupList from './LeadfollowupList';

// export profile

export default function LeadfollowupProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="LeadfollowupMainProfilePage",
    parentProfileItemId = "LeadfollowupProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Leadfollowup states
  const [stateItem, stateItemSetters] = useLeadfollowupState(settersOverrides);
  const lead_followupNode = stateItem.leadfollowupNode
  
  // -- basic states --//
  const paramLeadfollowupUptoken  = stateItem.leadfollowupUptoken
  const leadfollowupActionStatus = stateItem.leadfollowupActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setLeadfollowupNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postLeadfollowupFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateLeadfollowupFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postLeadfollowupFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("LeadfollowupProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    leadfollowupProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="LeadfollowupProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postLeadfollowupFormData} encType="multipart/form-data" id="lead_followup_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {lead_followupNode?.primkey ? (  <span> Follow up details / {lead_followupNode?._leads_list_name_lead_id || ""} </span> ) :(<span>  Add followup </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramLeadfollowupUptoken && (
                  <DeleteButton
                  src="LeadfollowupMainProfilePage"
                  tableName="lead_followup"
                  uptoken={paramLeadfollowupUptoken}
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
                
                {showNavigationIsle && ( <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramLeadfollowupUptoken && (
                  <>
                  
                </>
              )}
              
              {paramLeadfollowupUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="LeadfollowupMainProfilePage"
                tableName="lead_followup"
                uptoken={paramLeadfollowupUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="LeadfollowupMainProfilePage"
                tableName="lead_followup"
                link="./profile"
                label=" Add followup "
                icon="plus-circle" />
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
            <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                  <LiveSearchDropdown
                  apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                  tblName="leads_list"
                  parentTable="lead_followup"
                  inputName="txt__leads_list_name_lead_id"
                  hiddenInputName="txt_lead_id"
                  valueField="record_id"
                  displayField="name"
                  label="Client name"
                  defaultValue={{ record_id: lead_followupNode?.lead_id || "", name: lead_followupNode?._leads_list_name_lead_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-3 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Followup Type</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/lead_followup/leadfollowup"
                    idField="primkey"
                    labelField="followup_type"
                    inputName="txt_followup_type"
                    label="Followup Type"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={lead_followupNode?.followup_type || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="lead_followup"
                  field="followup_date"
                  label="Followup Date"
                  value={lead_followupNode?.followup_date || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Status</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/lead_followup/leadfollowup"
                    idField="primkey"
                    labelField="status"
                    inputName="txt_status"
                    label="Status"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={lead_followupNode?.status || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Potential</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/lead_followup/leadfollowup"
                    idField="primkey"
                    labelField="potential"
                    inputName="txt_potential"
                    label="Potential"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={lead_followupNode?.potential || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Stage</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/lead_followup/leadfollowup"
                    idField="primkey"
                    labelField="stage"
                    inputName="txt_stage"
                    label="Stage"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={lead_followupNode?.stage || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="lead_followup"
                  field="remark"
                  label="Notes"
                  value={lead_followupNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="LeadfollowupMainProfilePage"
                  tblName="lead_followup"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="lead_followup_uptoken" name="lead_followup_uptoken" value={paramLeadfollowupUptoken}/>
              <input type="hidden" id="lead_followup_mosy_action" name="lead_followup_mosy_action" value={leadfollowupActionStatus}/>
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
        {lead_followupNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Followup history`} </h5>
            
            <LeadfollowupList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : btoa(`where  lead_id ='${lead_followupNode?.lead_id}' `),
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateLeadfollowupEvent,
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

