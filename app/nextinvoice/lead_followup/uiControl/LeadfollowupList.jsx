'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from '../../../MosyUtils/hiveUtils';

import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadLeadfollowupListData, popDeleteDialog, InteprateLeadfollowupEvent  } from '../dataControl/LeadfollowupRequestHandler';

//state management
import { useLeadfollowupState } from '../dataControl/LeadfollowupStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//def logo
//import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//export list
export default function LeadfollowupList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../lead_followup/profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Leadfollowup states
  const [stateItem, stateItemSetters] = useLeadfollowupState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadLeadfollowupListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"lead_followup", keyword:stateItem.leadfollowupQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Lead Followup </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_lead_followup" name="txt_lead_followup" className="custom-search-input form-control" placeholder="Search in Lead Followup "
          onChange={(e) => stateItemSetters.setLeadfollowupQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qlead_followup_btn" name="qlead_followup_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="LeadfollowupList" link={customProfilePath} label=" Add followup " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="lead_followup_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Client name</b></th>
              <th scope="col"><b>Followup Type</b></th>
              <th scope="col"><b>Followup Date</b></th>
              <th scope="col"><b>Status</b></th>
              <th scope="col"><b>Potential</b></th>
              <th scope="col"><b>Stage</b></th>
              <th scope="col"><b>Notes</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.leadfollowupLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="8" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Lead Followup ...</h5>
                </td>
              </tr>
            ) : stateItem.leadfollowupListData?.length > 0 ? (
              stateItem.leadfollowupListData.map((listlead_followup_result, index) => (
                <Fragment key={`_row_${listlead_followup_result.primkey}`}>
                  <tr key={listlead_followup_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listlead_followup_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="lead_followup"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listlead_followup_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listlead_followup_result.lead_id}>{magicTrimText(listlead_followup_result._leads_list_name_lead_id, 70)}</span></td>
                    <td scope="col"><span title={listlead_followup_result.followup_type}>{magicTrimText(listlead_followup_result.followup_type, 70)}</span></td>
                    <td scope="col"><span title={listlead_followup_result.followup_date}>{mosyFormatDateOnly(listlead_followup_result.followup_date)}</span></td>
                    <td scope="col"><span title={listlead_followup_result.status}>{magicTrimText(listlead_followup_result.status, 70)}</span></td>
                    <td scope="col"><span title={listlead_followup_result.potential}>{magicTrimText(listlead_followup_result.potential, 70)}</span></td>
                    <td scope="col"><span title={listlead_followup_result.stage}>{magicTrimText(listlead_followup_result.stage, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listlead_followup_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="8" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no lead followup records found</h6>
                  
                  <AddNewButton src="LeadfollowupList"  link={customProfilePath} label=" Add followup " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="LeadfollowupList"
        tblName="lead_followup"
        totalPages={stateItem.leadfollowupListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
      
    </form>
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
    </div>
  );
  
}

