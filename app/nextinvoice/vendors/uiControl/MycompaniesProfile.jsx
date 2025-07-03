'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  "../../../MosyUtils/ActionModals";

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateMycompaniesFormAction, mycompaniesProfileData , popDeleteDialog, InteprateMycompaniesEvent } from '../dataControl/MycompaniesRequestHandler';

//state management
import { useMycompaniesState } from '../dataControl/MycompaniesStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

import  MycompaniesList from './MycompaniesList';

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
import { MosyLiveSearch } from '../../UiControl/customUI';



export default function MycompaniesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="MycompaniesMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Mycompanies states
  const [stateItem, stateItemSetters] = useMycompaniesState(settersOverrides);
  const companiesNode = stateItem.mycompaniesNode
  
  // -- basic states --//
  const paramMycompaniesUptoken  = stateItem.mycompaniesUptoken
  const mycompaniesActionStatus = stateItem.mycompaniesActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setMycompaniesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postMycompaniesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateMycompaniesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postMycompaniesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("MycompaniesProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    mycompaniesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("MycompaniesProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="MycompaniesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-11 rounded text-left p-2 mb-0  bg-white ">
        <div className="col-md-12 p-2 pr-lg-4 pl-lg-4 m-0">
          <form onSubmit={postMycompaniesFormData} encType="multipart/form-data" id="companies_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {companiesNode?.primkey ? (  <span>My companies Profile</span>) : (<span>Add Companies</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                
                {paramMycompaniesUptoken && (
                  <button
                  type="button"
                  className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                  onClick={() =>popDeleteDialog(paramMycompaniesUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} )}
                  
                  >
                  <i className='fa fa-trash'></i> Delete
                </button>)}
                
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <>{showNavigationIsle && (<div className="row justify-content-end m-0 p-0 col-md-12  p-3 bg-white hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                <Link href="./list" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                {paramMycompaniesUptoken && (
                  <>
                  
                </>
              )}
              
              
              {paramMycompaniesUptoken && (
                <button
                type="button"
                className="medium_btn border border-danger text-danger p-2 ml-3 mb-3 hive_profile_nav_del_btn"
                onClick={() =>popDeleteDialog(paramMycompaniesUptoken, {childStateSetters: stateItemSetters, parentStateSetters: parentStateSetters} , router)}
                
                >
                <i className='fa fa-trash'></i> Delete
              </button>)}
              
              {paramMycompaniesUptoken && (
                
                <AddNewButton link="./profile" label=" Add new" icon="plus-circle" />
                
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
                    
                    <MosySmartField
                    module="companies"
                    field="business_no"
                    label="Business No"
                    value={companiesNode?.business_no || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
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
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label >Email</label>
                      
                      <select name="txt_email" id="txt_email" className="form-control">
                        <option  value={companiesNode?.email || ""}>{companiesNode?.email || "Select Email"}</option>
                        <option>value1</option>
                        <option>value2</option>
                        <option>value3</option>
                        
                      </select>
                    </div>
                    
                    
                    <MosySmartField
                    module="companies"
                    field="business_name"
                    label="Business Name"
                    value={companiesNode?.business_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="location"
                    label="Location"
                    value={companiesNode?.location || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="specialty"
                    label="Specialty"
                    value={companiesNode?.specialty || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="remark"
                    label="Remark"
                    value={companiesNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="logo"
                    label="Logo"
                    value={companiesNode?.logo || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="bank_name"
                    label="Bank Name"
                    value={companiesNode?.bank_name || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="account_no"
                    label="Account No"
                    value={companiesNode?.account_no || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="pin_no"
                    label="Pin No"
                    value={companiesNode?.pin_no || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="companies"
                    field="swort_code"
                    label="Swort Code"
                    value={companiesNode?.swort_code || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons tblName="companies" extraClass="optional-custom-class" />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="companies_uptoken" name="companies_uptoken" value={paramMycompaniesUptoken}/>
                <input type="hidden" id="companies_mosy_action" name="companies_mosy_action" value={mycompaniesActionStatus}/>
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
  
