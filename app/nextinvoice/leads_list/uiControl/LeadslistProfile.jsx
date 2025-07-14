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
import { inteprateLeadslistFormAction, leadslistProfileData , popDeleteDialog, InteprateLeadslistEvent } from '../dataControl/LeadslistRequestHandler';

//state management
import { useLeadslistState } from '../dataControl/LeadslistStateManager';

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
import { convertToCustomer } from '../../nextinvoice_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

import LeadfollowupProfile from '../../lead_followup/uiControl/LeadfollowupProfile';

import {InteprateLeadfollowupEvent } from '../../lead_followup/dataControl/LeadfollowupRequestHandler';


// export profile

export default function LeadslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="LeadslistMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Leadslist states
  const [stateItem, stateItemSetters] = useLeadslistState(settersOverrides);
  const leads_listNode = stateItem.leadslistNode
  
  // -- basic states --//
  const paramLeadslistUptoken  = stateItem.leadslistUptoken
  const leadslistActionStatus = stateItem.leadslistActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setLeadslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postLeadslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateLeadslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postLeadslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("LeadslistProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    leadslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("LeadslistProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setLeadfollowupCustomProfileQuery Script
  const setLeadfollowupCustomProfileQuery = stateItemSetters.setLeadfollowupCustomProfileQuery;
  const leadfollowupCustomProfileQuery =  stateItem.leadfollowupCustomProfileQuery;
  
  useEffect(() => {
    if (leads_listNode?.primkey && setLeadfollowupCustomProfileQuery) {
      
      const query = `where lead_id ='${leads_listNode?.record_id}'  `;
      
      const tokenUrl = mosyUrlParam("lead_followup_uptoken")
      
      if(!tokenUrl)
      {
        setLeadfollowupCustomProfileQuery(query);
      }
      
    }
  }, [leads_listNode, setLeadfollowupCustomProfileQuery]);
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="LeadslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postLeadslistFormData} encType="multipart/form-data" id="leads_list_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {leads_listNode?.primkey ? (  <span> Lead profile / {leads_listNode?.name || ""}</span> ) :(<span> New Lead </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramLeadslistUptoken && (
                  <DeleteButton
                  src="LeadslistMainProfilePage"
                  tableName="leads_list"
                  uptoken={paramLeadslistUptoken}
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
                
                
                
                {paramLeadslistUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Convert to customer "
                  icon="user-plus"
                  onClick={()=>{convertToCustomer({
                    name : (leads_listNode?.name || ''),
                    email : (leads_listNode?.email || ''),
                    tel : (leads_listNode?.tel || '')
                  })}}
                  />
                  
                </>
              )}
              
              {paramLeadslistUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="LeadslistMainProfilePage"
                tableName="leads_list"
                uptoken={paramLeadslistUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="LeadslistMainProfilePage"
                tableName="leads_list"
                link="./profile"
                label="New Lead "
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
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Basic Info</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <MosySmartField
                  module="leads_list"
                  field="name"
                  label="Name"
                  value={leads_listNode?.name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="leads_list"
                  field="tel"
                  label="Tel"
                  value={leads_listNode?.tel || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="leads_list"
                  field="email"
                  label="Email"
                  value={leads_listNode?.email || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="leads_list"
                  field="lead_date"
                  label="Lead Date"
                  value={leads_listNode?.lead_date || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Source And Status</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Tag</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                    idField="primkey"
                    labelField="tag"
                    inputName="txt_tag"
                    label="Tag"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={leads_listNode?.tag || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Source</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                    idField="primkey"
                    labelField="source"
                    inputName="txt_source"
                    label="Source"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={leads_listNode?.source || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Campaign</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                    idField="primkey"
                    labelField="campaign"
                    inputName="txt_campaign"
                    label="Campaign"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={leads_listNode?.campaign || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="leads_list"
                  field="cost"
                  label="Cost"
                  value={leads_listNode?.cost || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Potential</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                    idField="primkey"
                    labelField="potential"
                    inputName="txt_potential"
                    label="Potential"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={leads_listNode?.potential || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Stage</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/leads_list/leadslist"
                    idField="primkey"
                    labelField="stage"
                    inputName="txt_stage"
                    label="Stage"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={leads_listNode?.stage || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-12 hive_data_cell">
                    <label >Remark</label>
                    <MosyHtmlEditor
                    key={`reload - ${leads_listNode?.primkey}`}
                    module="leads_list"
                    field="txt_remark"
                    label="Remark"
                    value={leads_listNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="content_editable"
                    cellOverrides={{additionalClass: "d-none"}}
                    
                    />
                    <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="remark_toprint">{leads_listNode?.remark || ""}</div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="LeadslistMainProfilePage"
                  tblName="leads_list"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="leads_list_uptoken" name="leads_list_uptoken" value={paramLeadslistUptoken}/>
              <input type="hidden" id="leads_list_mosy_action" name="leads_list_mosy_action" value={leadslistActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          {leads_listNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Follow up lead`} </h5>
              <LeadfollowupProfile
              key={`${ leadfollowupCustomProfileQuery}-${localEventSignature}`}
              dataIn={{
                
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : leadfollowupCustomProfileQuery,
                hostParent : "LeadslistProfile",
                customProfileData :
                //lead_followup data
                {
                  lead_id : (leads_listNode?.record_id || ""),
                  _leads_list_name_lead_id: (leads_listNode?.name || "")
                }
                
                
                
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

