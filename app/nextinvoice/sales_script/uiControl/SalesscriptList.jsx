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
import { loadSalesscriptListData, popDeleteDialog, InteprateSalesscriptEvent  } from '../dataControl/SalesscriptRequestHandler';

//state management
import { useSalesscriptState } from '../dataControl/SalesscriptStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//def logo
//import logo from '../../../img/logo/logo.png'; // outside public!

//large text
//import ReactMarkdown from 'react-markdown';

//export list
export default function SalesscriptList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../sales_script/profile",
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
  
  //manage Salesscript states
  const [stateItem, stateItemSetters] = useSalesscriptState(settersOverrides);
  
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
    
    loadSalesscriptListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"sales_script", keyword:stateItem.salesscriptQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Sales Script </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_sales_script" name="txt_sales_script" className="custom-search-input form-control" placeholder="Search in Sales Script "
          onChange={(e) => stateItemSetters.setSalesscriptQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsales_script_btn" name="qsales_script_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SalesscriptList" link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="sales_script_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Title</b></th>
              <th scope="col"><b>Tag</b></th>
              <th scope="col"><b>Event</b></th>
              <th scope="col"><b>Reply Rate</b></th>
              <th scope="col"><b>Message</b></th>
              <th scope="col"><b>Lead Reply</b></th>
              <th scope="col"><b>Hive Site Id</b></th>
              <th scope="col"><b>Hive Site Name</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.salesscriptLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="9" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Sales Script ...</h5>
                </td>
              </tr>
            ) : stateItem.salesscriptListData?.length > 0 ? (
              stateItem.salesscriptListData.map((listsales_script_result, index) => (
                <Fragment key={`_row_${listsales_script_result.primkey}`}>
                  <tr key={listsales_script_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listsales_script_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="sales_script"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listsales_script_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listsales_script_result.title}>{magicTrimText(listsales_script_result.title, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.tag}>{magicTrimText(listsales_script_result.tag, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.event}>{magicTrimText(listsales_script_result.event, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.reply_rate}>{magicTrimText(listsales_script_result.reply_rate, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.message}>{magicTrimText(listsales_script_result.message, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.lead_reply}>{magicTrimText(listsales_script_result.lead_reply, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.hive_site_id}>{magicTrimText(listsales_script_result.hive_site_id, 70)}</span></td>
                    <td scope="col"><span title={listsales_script_result.hive_site_name}>{magicTrimText(listsales_script_result.hive_site_name, 70)}</span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="9" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no sales script records found</h6>
                  
                  <AddNewButton src="SalesscriptList"  link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="SalesscriptList"
        tblName="sales_script"
        totalPages={stateItem.salesscriptListPageCount}
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

