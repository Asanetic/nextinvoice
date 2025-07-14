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
import { loadLeadslistListData, popDeleteDialog, InteprateLeadslistEvent  } from '../dataControl/LeadslistRequestHandler';

//state management
import { useLeadslistState } from '../dataControl/LeadslistStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//def logo
//import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//export list
export default function LeadslistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../leads_list/profile",
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
  
  //manage Leadslist states
  const [stateItem, stateItemSetters] = useLeadslistState(settersOverrides);
  
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
    
    loadLeadslistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"leads_list", keyword:stateItem.leadslistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Leads List </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_leads_list" name="txt_leads_list" className="custom-search-input form-control" placeholder="Search in Leads List "
          onChange={(e) => stateItemSetters.setLeadslistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qleads_list_btn" name="qleads_list_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="LeadslistList" link={customProfilePath} label="New Lead " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="leads_list_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Name</b></th>
              <th scope="col"><b>Tel</b></th>
              <th scope="col"><b>Email</b></th>
              <th scope="col"><b>Lead Date</b></th>
              <th scope="col"><b>Source</b></th>
              <th scope="col"><b>Campaign</b></th>
              <th scope="col"><b>Cost</b></th>
              <th scope="col"><b>Potential</b></th>
              <th scope="col"><b>Stage</b></th>
              <th scope="col"><b>Tag</b></th>
              <th scope="col"><b>Remark</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.leadslistLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="12" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Leads List ...</h5>
                </td>
              </tr>
            ) : stateItem.leadslistListData?.length > 0 ? (
              stateItem.leadslistListData.map((listleads_list_result, index) => (
                <Fragment key={`_row_${listleads_list_result.primkey}`}>
                  <tr key={listleads_list_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listleads_list_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="leads_list"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listleads_list_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listleads_list_result.name}>{magicTrimText(listleads_list_result.name, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.tel}>{magicTrimText(listleads_list_result.tel, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.email}>{magicTrimText(listleads_list_result.email, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.lead_date}>{mosyFormatDateOnly(listleads_list_result.lead_date)}</span></td>
                    <td scope="col"><span title={listleads_list_result.source}>{magicTrimText(listleads_list_result.source, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.campaign}>{magicTrimText(listleads_list_result.campaign, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.cost}>{magicTrimText(listleads_list_result.cost, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.potential}>{magicTrimText(listleads_list_result.potential, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.stage}>{magicTrimText(listleads_list_result.stage, 70)}</span></td>
                    <td scope="col"><span title={listleads_list_result.tag}>{magicTrimText(listleads_list_result.tag, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listleads_list_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="12" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no leads list records found</h6>
                  
                  <AddNewButton src="LeadslistList"  link={customProfilePath} label="New Lead " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="LeadslistList"
        tblName="leads_list"
        totalPages={stateItem.leadslistListPageCount}
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

