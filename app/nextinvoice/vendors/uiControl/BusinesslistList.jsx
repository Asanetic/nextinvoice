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
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadBusinesslistListData, popDeleteDialog, InteprateBusinesslistEvent  } from '../dataControl/BusinesslistRequestHandler';

//state management
import { useBusinesslistState } from '../dataControl/BusinesslistStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

//display large texts
import ReactMarkdown from 'react-markdown';

//image
import logo from '../../../img/logo/logo.png'; // outside public!


//export list
export default function BusinesslistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../vendors/business",
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
  
  //manage Businesslist states
  const [stateItem, stateItemSetters] = useBusinesslistState(settersOverrides);
  
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
    
    loadBusinesslistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"companies", keyword:stateItem.businesslistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Business list </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_companies" name="txt_companies" className="custom-search-input form-control" placeholder="Search in Business list "
          onChange={(e) => stateItemSetters.setBusinesslistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qcompanies_btn" name="qcompanies_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="businesslist" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="BusinesslistList" link={customProfilePath} label="Add business " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="companies_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              <th>Logo</th>
              <th scope="col"><b>Business Name</b></th>
              <th scope="col"><b>Mobile</b></th>
              <th scope="col"><b>Email</b></th>
              <th scope="col"><b>Location</b></th>
              <th scope="col"><b>Specialty</b></th>
              <th scope="col"><b>Remark</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.businesslistLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="7" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Business list ...</h5>
                </td>
              </tr>
            ) : stateItem.businesslistListData?.length > 0 ? (
              stateItem.businesslistListData.map((listcompanies_result, index) => (
                <Fragment key={`_row_${listcompanies_result.primkey}`}>
                  <tr key={listcompanies_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listcompanies_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="companies"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listcompanies_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <MosyImageViewer
                      media={`/api/mediaroom?media=${btoa((listcompanies_result.logo || ""))}`}
                      mediaRoot={""}
                      defaultLogo={logo.src}
                      imageClass="small_thumbnail"
                      />
                    </td>
                    <td scope="col"><span title={listcompanies_result.business_name}>{magicTrimText(listcompanies_result.business_name, 70)}</span></td>
                    <td scope="col"><span title={listcompanies_result.mobile}>{magicTrimText(listcompanies_result.mobile, 70)}</span></td>
                    <td scope="col"><span title={listcompanies_result.email}>{magicTrimText(listcompanies_result.email, 70)}</span></td>
                    <td scope="col"><span title={listcompanies_result.location}>{magicTrimText(listcompanies_result.location, 70)}</span></td>
                    <td scope="col"><span title={listcompanies_result.specialty}>{magicTrimText(listcompanies_result.specialty, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listcompanies_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="8" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no companies records found</h6>
                  
                  <AddNewButton src="BusinesslistList"  link={customProfilePath} label="Add business " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        src="BusinesslistList"
        tblName="companies"
        totalPages={stateItem.businesslistListPageCount}
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

