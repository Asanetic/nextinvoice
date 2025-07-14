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
import { inteprateMydocumentsFormAction, mydocumentsProfileData , popDeleteDialog, InteprateMydocumentsEvent } from '../dataControl/MydocumentsRequestHandler';

//state management
import { useMydocumentsState } from '../dataControl/MydocumentsStateManager';

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
import { downloadDocument  } from '../../nextinvoice_custom_functions';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

import  MydocumentsList from './MydocumentsList';

import { MosyLiveSearch } from '../../UiControl/customUI';

// export profile

export default function MydocumentsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="MydocumentsMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Mydocuments states
  const [stateItem, stateItemSetters] = useMydocumentsState(settersOverrides);
  const quick_notesNode = stateItem.mydocumentsNode
  
  // -- basic states --//
  const paramMydocumentsUptoken  = stateItem.mydocumentsUptoken
  const mydocumentsActionStatus = stateItem.mydocumentsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setMydocumentsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postMydocumentsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateMydocumentsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postMydocumentsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("MydocumentsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    mydocumentsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("MydocumentsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="MydocumentsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postMydocumentsFormData} encType="multipart/form-data" id="quick_notes_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {quick_notesNode?.primkey ? (  <span> {quick_notesNode?.note_title || ""}</span> ) :(<span> New document </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramMydocumentsUptoken && (
                  <DeleteButton
                  src="MydocumentsMainProfilePage"
                  tableName="quick_notes"
                  uptoken={paramMydocumentsUptoken}
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
                
                
                
                {paramMydocumentsUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Find documents"
                  icon="search"
                  onClick={()=>{
                    MosyLiveSearch({
                      api:'/api/nextinvoice/quick_notes/mydocuments',
                      displayField:'note_title',
                      tableName:'quick_notes',
                      actionName : 'load_profile',
                      title:'Search by title, tag or content',
                      actionData : {path: '../quick_notes/profile', router : router , token : `{{primkey}}`, stateSetters : stateItemSetters , actionName:`load_profile`}
                    })
                    
                  }}
                  />
                  
                  <MosyActionButton
                  label=" Print"
                  icon="print"
                  onClick={()=>{downloadDocument({docId:(quick_notesNode?.primkey || '')})}}
                  />
                  
                </>
              )}
              
              {paramMydocumentsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="MydocumentsMainProfilePage"
                tableName="quick_notes"
                uptoken={paramMydocumentsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="MydocumentsMainProfilePage"
                tableName="quick_notes"
                link="./profile"
                label="New document "
                icon="file-text" />
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
                  
                  <MosySmartField
                  module="quick_notes"
                  field="note_title"
                  label="Title"
                  value={quick_notesNode?.note_title || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Tag / category</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/quick_notes/mydocuments"
                    idField="primkey"
                    labelField="note_tag"
                    inputName="txt_note_tag"
                    label="Tag / category"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={quick_notesNode?.note_tag || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-4 hive_data_cell ">
                    <label className="d-none">Folder Name</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/quick_notes/mydocuments"
                    idField="primkey"
                    labelField="folder_name"
                    inputName="txt_folder_name"
                    label="Folder Name"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={quick_notesNode?.folder_name || ""}
                    />
                  </div>
                  
                  
                  <div className="form-group col-md-12 hive_data_cell">
                    <label >Content</label>
                    <MosyHtmlEditor
                    key={`reload - ${quick_notesNode?.primkey}`}
                    module="quick_notes"
                    field="txt_note_details"
                    label="Content"
                    value={quick_notesNode?.note_details || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="content_editable"
                    cellOverrides={{additionalClass: "d-none"}}
                    
                    />
                    <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="note_details_toprint">{quick_notesNode?.note_details || ""}</div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="MydocumentsMainProfilePage"
                  tblName="quick_notes"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="quick_notes_uptoken" name="quick_notes_uptoken" value={paramMydocumentsUptoken}/>
              <input type="hidden" id="quick_notes_mosy_action" name="quick_notes_mosy_action" value={mydocumentsActionStatus}/>
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
        {quick_notesNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`More documents`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../quick_notes/list?quick_notes_mosyfilter`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <MydocumentsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : '',
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateMydocumentsEvent,
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

