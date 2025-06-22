'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime} from "../../../MosyUtils/hiveUtils"

import { mosyFilterUrl } from "../../DataControl/MosyFilterEngine";


//components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyImageViewer ,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi
} from "../../UiControl/componentControl";

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadMycompaniesListData, popDeleteDialog, InteprateMycompaniesEvent  } from '../dataControl/MycompaniesRequestHandler';

//state management
import { useMycompaniesState } from '../dataControl/MycompaniesStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

import { MosyLiveSearch } from '../../UiControl/customUI';

export default function MycompaniesList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../vendors/profile",
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
  
  //manage Mycompanies states
  const [stateItem, stateItemSetters] = useMycompaniesState(settersOverrides);
  
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
    
    loadMycompaniesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"companies", keyword:stateItem.mycompaniesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> My companies </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_companies" name="txt_companies" className="custom-search-input form-control" placeholder="Search in My companies "
          onChange={(e) => stateItemSetters.setMycompaniesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qcompanies_btn" name="qcompanies_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="companies_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Business No</b></th>
              <th scope="col"><b>Mobile</b></th>
              <th scope="col"><b>Email</b></th>
              <th scope="col"><b>Business Name</b></th>
              <th scope="col"><b>Location</b></th>
              <th scope="col"><b>Specialty</b></th>
              <th scope="col"><b>Remark</b></th>
              <th scope="col"><b>Logo</b></th>
              <th scope="col"><b>Bank Name</b></th>
              <th scope="col"><b>Account No</b></th>
              <th scope="col"><b>Pin No</b></th>
              <th scope="col"><b>Swort Code</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.mycompaniesLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="13" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading My companies ...</h5>
                </td>
              </tr>
            ) : stateItem.mycompaniesListData?.length > 0 ? (
              stateItem.mycompaniesListData.map((listcompanies_result, index) => (
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
                    
                    <td scope="col"><span title={listcompanies_result.business_no}>{magicTrimText(listcompanies_result.business_no, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.mobile}>{magicTrimText(listcompanies_result.mobile, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.email}>{magicTrimText(listcompanies_result.email, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.business_name}>{magicTrimText(listcompanies_result.business_name, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.location}>{magicTrimText(listcompanies_result.location, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.specialty}>{magicTrimText(listcompanies_result.specialty, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.remark}>{magicTrimText(listcompanies_result.remark, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.logo}>{magicTrimText(listcompanies_result.logo, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.bank_name}>{magicTrimText(listcompanies_result.bank_name, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.account_no}>{magicTrimText(listcompanies_result.account_no, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.pin_no}>{magicTrimText(listcompanies_result.pin_no, 30)}</span></td>
                    <td scope="col"><span title={listcompanies_result.swort_code}>{magicTrimText(listcompanies_result.swort_code, 30)}</span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="13" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no companies records found</h6>
                  
                  <AddNewButton link={customProfilePath} label=" Add new" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="companies"
        totalPages={stateItem.mycompaniesListPageCount}
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

