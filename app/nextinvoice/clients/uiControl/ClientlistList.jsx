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
  MosyPaginationUi
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadClientlistListData, popDeleteDialog, InteprateClientlistEvent  } from '../dataControl/ClientlistRequestHandler';

//state management
import { useClientlistState } from '../dataControl/ClientlistStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';



//export list
export default function ClientlistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../clients/clientprofile",
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
  
  //manage Clientlist states
  const [stateItem, stateItemSetters] = useClientlistState(settersOverrides);
  
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
    
    loadClientlistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"clients", keyword:stateItem.clientlistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Client List </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_clients" name="txt_clients" className="custom-search-input form-control" placeholder="Search in Client List "
          onChange={(e) => stateItemSetters.setClientlistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qclients_btn" name="qclients_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="ClientlistList" link={customProfilePath} label="Create client account " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="clients_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Client Name</b></th>
              <th scope="col"><b>Client Email</b></th>
              <th scope="col"><b>Client Tel</b></th>
              <th scope="col"><b>Client Location</b></th>
              <th scope="col"><b>Date Registered</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.clientlistLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="6" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Client List ...</h5>
                </td>
              </tr>
            ) : stateItem.clientlistListData?.length > 0 ? (
              stateItem.clientlistListData.map((listclients_result, index) => (
                <Fragment key={`_row_${listclients_result.primkey}`}>
                  <tr key={listclients_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listclients_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="clients"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listclients_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listclients_result.client_name}>{magicTrimText(listclients_result.client_name, 30)}</span></td>
                    <td scope="col"><span title={listclients_result.client_email}>{magicTrimText(listclients_result.client_email, 30)}</span></td>
                    <td scope="col"><span title={listclients_result.client_tel}>{magicTrimText(listclients_result.client_tel, 30)}</span></td>
                    <td scope="col"><span title={listclients_result.client_location}>{magicTrimText(listclients_result.client_location, 30)}</span></td>
                    <td scope="col"><span title={listclients_result.date_registered}>{mosyFormatDateOnly(listclients_result.date_registered)}</span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="6" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no clients records found</h6>
                  
                  <AddNewButton src="ClientlistList"  link={customProfilePath} label="Create client account " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="ClientlistList"
        tblName="clients"
        totalPages={stateItem.clientlistListPageCount}
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

