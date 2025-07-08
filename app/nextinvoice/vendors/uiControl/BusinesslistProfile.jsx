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
import { inteprateBusinesslistFormAction, businesslistProfileData , popDeleteDialog, InteprateBusinesslistEvent } from '../dataControl/BusinesslistRequestHandler';

//state management
import { useBusinesslistState } from '../dataControl/BusinesslistStateManager';

//list
import  BusinesslistList from './BusinesslistList';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//large text manager
import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'
import ReactMarkdown from 'react-markdown';

//image
import logo from '../../../img/logo/logo.png'; // outside public!

// export profile

export default function BusinesslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="BusinesslistMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Businesslist states
  const [stateItem, stateItemSetters] = useBusinesslistState(settersOverrides);
  const companiesNode = stateItem.businesslistNode
  
  // -- basic states --//
  const paramBusinesslistUptoken  = stateItem.businesslistUptoken
  const businesslistActionStatus = stateItem.businesslistActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setBusinesslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postBusinesslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateBusinesslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postBusinesslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("BusinesslistProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    businesslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("BusinesslistProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="BusinesslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-11 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postBusinesslistFormData} encType="multipart/form-data" id="companies_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {companiesNode?.primkey ? (  <span> Company / {companiesNode?.business_name || ""}</span> ) :(<span> Add business </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramBusinesslistUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramBusinesslistUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
                  >
                  <i className='fa fa-trash'></i> Delete
                </button>)}
                
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <>{showNavigationIsle && (<div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                <Link href="./businesslist" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                {paramBusinesslistUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramBusinesslistUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramBusinesslistUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramBusinesslistUptoken && (
                
                <AddNewButton link="./business" label="Add business " icon="plus-circle" />
                
              )}
              
            </div>
          </div>)}</>
          <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
          {/*    Navigation isle      */}
          <div className="row justify-content-center m-0 p-0 col-md-12" id="">
            {/*    Image section isle      */}
            
            <div className="col-md-6 mr-lg-5">
              
              <div className="col-md-12 p-0 text-center mb-3">
                <div className="col-md-12 m-2"><b>Logo</b></div>
                <MosyImageViewer
                media={`/api/mediaroom?media=${btoa((companiesNode?.logo || ""))}`}
                mediaRoot={""}
                defaultLogo={logo.src}
                imageClass="rounded_avatar"
                />
                
                <MosyFileUploadButton
                tblName="companies"
                attribute="logo"
                />
                <input type="hidden" name="media_companies_logo" value={companiesNode?.logo || ""}/>
              </div>
              
              
            </div>
            {/*    Image section isle      */}
            
            {/*  //-------------    main content starts here  ------------------------------ */}
            
            
            
            <div className="col-md-12 row justify-content-center m-0  p-0">
              {/*    Input cells section isle      */}
              <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                <div className="col-md-12 row justify-content-center p-0 m-0">
                  <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                    
                    <MosySmartField
                    module="companies"
                    field="business_name"
                    label="Business Name"
                    value={companiesNode?.business_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="mobile"
                    label="Mobile"
                    value={companiesNode?.mobile || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="email"
                    label="Email"
                    value={companiesNode?.email || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-7 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-7 hive_data_cell ">
                      <label className="d-none">Location</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/nextinvoice/vendors/businesslist"
                      idField="primkey"
                      labelField="location"
                      inputName="txt_location"
                      label="Location"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={companiesNode?.location || ""}
                      />
                    </div>
                    
                    
                    <div className="form-group col-md-7 hive_data_cell ">
                      <label className="d-none">Specialty</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/nextinvoice/vendors/businesslist"
                      idField="primkey"
                      labelField="specialty"
                      inputName="txt_specialty"
                      label="Specialty"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={companiesNode?.specialty || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="companies"
                    field="remark"
                    label="Remark"
                    value={companiesNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-7 hive_data_cell"}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="companies" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="companies_uptoken" name="companies_uptoken" value={paramBusinesslistUptoken}/>
                <input type="hidden" id="companies_mosy_action" name="companies_mosy_action" value={businesslistActionStatus}/>
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
          {companiesNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`My companies`} </h5>
              
              <div className="col-md-12 p-2 text-right ">
                <a href={`../vendors/businesslist?companies_mosyfilter`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
              </div>
              
              <BusinesslistList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : '',
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateBusinesslistEvent,
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

