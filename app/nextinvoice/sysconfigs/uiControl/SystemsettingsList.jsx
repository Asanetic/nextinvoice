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
import { loadSystemsettingsListData, popDeleteDialog, InteprateSystemsettingsEvent  } from '../dataControl/SystemsettingsRequestHandler';

//state management
import { useSystemsettingsState } from '../dataControl/SystemsettingsStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//def logo
//import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//export list
export default function SystemsettingsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../sysconfigs/profile",
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
  
  //manage Systemsettings states
  const [stateItem, stateItemSetters] = useSystemsettingsState(settersOverrides);
  
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
    
    loadSystemsettingsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  return (
    
    <div className={`col-md-12 bg-white p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"account_urls", keyword:stateItem.systemsettingsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> System settings </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_account_urls" name="txt_account_urls" className="custom-search-input form-control" placeholder="Search in System settings "
          onChange={(e) => stateItemSetters.setSystemsettingsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qaccount_urls_btn" name="qaccount_urls_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SystemsettingsList" link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="account_urls_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Setting Name</b></th>
              <th scope="col"><b>Setting value</b></th>
              <th scope="col"><b>Description</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.systemsettingsLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="4" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading System settings ...</h5>
                </td>
              </tr>
            ) : stateItem.systemsettingsListData?.length > 0 ? (
              stateItem.systemsettingsListData.map((listaccount_urls_result, index) => {
                
                
                
                return(
                  <Fragment key={`_row_${listaccount_urls_result.primkey}`}>
                    <tr key={listaccount_urls_result.primkey}>
                      <td>
                        <div className="table_cell_dropdown">
                          <div className="table_cell_dropbtn"><b>{listaccount_urls_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="account_urls"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listaccount_urls_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listaccount_urls_result.url_name}>{magicTrimText(listaccount_urls_result.url_name, 70)}</span></td>
                      <td scope="col"><span title={listaccount_urls_result.url}>{magicTrimText(listaccount_urls_result.url, 70)}</span></td>
                      <td scope="col"><span>
                        <ReactMarkdown>
                          
                          {magicTrimText(listaccount_urls_result.description, 70)}
                          
                        </ReactMarkdown>
                      </span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="4" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no account urls records found</h6>
                    
                    <AddNewButton src="SystemsettingsList"  link={customProfilePath} label=" Add new" icon="plus-circle" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
          
          <MosyPaginationUi
          src="SystemsettingsList"
          tblName="account_urls"
          totalPages={stateItem.systemsettingsListPageCount}
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
  
