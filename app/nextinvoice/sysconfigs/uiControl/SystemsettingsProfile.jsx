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
import { inteprateSystemsettingsFormAction, systemsettingsProfileData , popDeleteDialog, InteprateSystemsettingsEvent } from '../dataControl/SystemsettingsRequestHandler';

//state management
import { useSystemsettingsState } from '../dataControl/SystemsettingsStateManager';

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

export default function SystemsettingsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SystemsettingsMainProfilePage",
    parentProfileItemId = "SystemsettingsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Systemsettings states
  const [stateItem, stateItemSetters] = useSystemsettingsState(settersOverrides);
  const account_urlsNode = stateItem.systemsettingsNode
  
  // -- basic states --//
  const paramSystemsettingsUptoken  = stateItem.systemsettingsUptoken
  const systemsettingsActionStatus = stateItem.systemsettingsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSystemsettingsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSystemsettingsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSystemsettingsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSystemsettingsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SystemsettingsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    systemsettingsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SystemsettingsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSystemsettingsFormData} encType="multipart/form-data" id="account_urls_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {account_urlsNode?.primkey ? (  <span>System settings Profile</span>) : (<span>Add Account Urls</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSystemsettingsUptoken && (
                  <DeleteButton
                  src="SystemsettingsMainProfilePage"
                  tableName="account_urls"
                  uptoken={paramSystemsettingsUptoken}
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
                
                
                
                {paramSystemsettingsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramSystemsettingsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="SystemsettingsMainProfilePage"
                tableName="account_urls"
                uptoken={paramSystemsettingsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="SystemsettingsMainProfilePage"
                tableName="account_urls"
                link="./profile"
                label=" Add new"
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
                  
                  <div className="form-group col-md-6 hive_data_cell ">
                    <label >Setting Name</label>
                    
                    <select name="txt_url_name" id="txt_url_name" className="form-control">
                      <option  value={account_urlsNode?.url_name || ""}>{account_urlsNode?.url_name || "Select Setting Name"}</option>
                      <option>sms_api</option>
                      <option>company_name</option>
                      <option>email_address</option>
                      <option>email_password</option>
                      
                    </select>
                  </div>
                  
                  
                  <MosySmartField
                  module="account_urls"
                  field="url"
                  label="Setting value"
                  value={account_urlsNode?.url || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="account_urls"
                  field="description"
                  label="Description"
                  value={account_urlsNode?.description || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="SystemsettingsMainProfilePage"
                  tblName="account_urls"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="account_urls_uptoken" name="account_urls_uptoken" value={paramSystemsettingsUptoken}/>
              <input type="hidden" id="account_urls_mosy_action" name="account_urls_mosy_action" value={systemsettingsActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
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

