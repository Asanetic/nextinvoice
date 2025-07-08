'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime, mosyTonum} from '../../../MosyUtils/hiveUtils';

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
import { loadInvoicepaymentsListData, popDeleteDialog, InteprateInvoicepaymentsEvent  } from '../dataControl/InvoicepaymentsRequestHandler';

//state management
import { useInvoicepaymentsState } from '../dataControl/InvoicepaymentsStateManager';

//nextinvoice custom functions
//import {  } from '../../nextinvoice_custom_functions';

import ReactMarkdown from 'react-markdown';


//export list
export default function InvoicepaymentsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../payments/profile",
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
  
  //manage Invoicepayments states
  const [stateItem, stateItemSetters] = useInvoicepaymentsState(settersOverrides);
  
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
    
    loadInvoicepaymentsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"invoice_payments", keyword:stateItem.invoicepaymentsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Invoice payments </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_invoice_payments" name="txt_invoice_payments" className="custom-search-input form-control" placeholder="Search in Invoice payments "
          onChange={(e) => stateItemSetters.setInvoicepaymentsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qinvoice_payments_btn" name="qinvoice_payments_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            <AddNewButton link={customProfilePath} label=" Add payments " icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bg-white bottom_tbl_handler">
        
        <table className="table table-hover  text-left printTarget" id="invoice_payments_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Invoice number </b></th>
              <th scope="col"><b>Date Paid</b></th>
              <th scope="col"><b>Amount Paid</b></th>
              <th scope="col"><b>Ref No</b></th>
              <th scope="col"><b>Payment Mode</b></th>
              <th scope="col"><b>Remark</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.invoicepaymentsLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="7" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Invoice payments ...</h5>
                </td>
              </tr>
            ) : stateItem.invoicepaymentsListData?.length > 0 ? (
              stateItem.invoicepaymentsListData.map((listinvoice_payments_result, index) => (
                <Fragment key={`_row_${listinvoice_payments_result.primkey}`}>
                  <tr key={listinvoice_payments_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn"><b>{listinvoice_payments_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="invoice_payments"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listinvoice_payments_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listinvoice_payments_result.invoice_id}>{magicTrimText(listinvoice_payments_result._invoices_invoice_no_invoice_id, 70)}</span></td>
                    <td scope="col"><span title={listinvoice_payments_result.date_paid}>{mosyFormatDateOnly(listinvoice_payments_result.date_paid)}</span></td>
                    <td scope="col"><span>{mosyTonum(listinvoice_payments_result.amount_paid)}</span></td>
                    <td scope="col"><span title={listinvoice_payments_result.ref_no}>{magicTrimText(listinvoice_payments_result.ref_no, 70)}</span></td>
                    <td scope="col"><span title={listinvoice_payments_result.payment_mode}>{magicTrimText(listinvoice_payments_result.payment_mode, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listinvoice_payments_result.remark, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    
                  </tr>
                  
                </Fragment>
                
              ))
              
            ) : (
              
              <tr><td colSpan="7" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no invoice payments records found</h6>
                  
                  <AddNewButton link={customProfilePath} label=" Add payments " icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
          </tbody>
        </table>
        
        <MosyPaginationUi
        tblName="invoice_payments"
        totalPages={stateItem.invoicepaymentsListPageCount}
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

