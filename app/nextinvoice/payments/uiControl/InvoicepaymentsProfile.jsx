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
import { inteprateInvoicepaymentsFormAction, invoicepaymentsProfileData , popDeleteDialog, InteprateInvoicepaymentsEvent } from '../dataControl/InvoicepaymentsRequestHandler';

//state management
import { useInvoicepaymentsState } from '../dataControl/InvoicepaymentsStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton
} from '../../UiControl/componentControl';

//nextinvoice custom functions
import { downloadReceipt  } from '../../nextinvoice_custom_functions';

//payment history list
import  InvoicepaymentsList from './InvoicepaymentsList';


// export profile

export default function InvoicepaymentsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="InvoicepaymentsMainProfilePage"
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
  const invoice_paymentsNode = stateItem.invoicepaymentsNode
  
  // -- basic states --//
  const paramInvoicepaymentsUptoken  = stateItem.invoicepaymentsUptoken
  const invoicepaymentsActionStatus = stateItem.invoicepaymentsActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setInvoicepaymentsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postInvoicepaymentsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateInvoicepaymentsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postInvoicepaymentsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("InvoicepaymentsProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    invoicepaymentsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("InvoicepaymentsProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="InvoicepaymentsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postInvoicepaymentsFormData} encType="multipart/form-data" id="invoice_payments_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {invoice_paymentsNode?.primkey ? (  <span> Payment {invoice_paymentsNode?.ref_no || ""}</span> ) :(<span>  Add payments </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramInvoicepaymentsUptoken && (
                  <DeleteButton
                  src="InvoicepaymentsMainProfilePage"
                  tableName="invoice_payments"
                  uptoken={paramInvoicepaymentsUptoken}
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
                
                
                
                {paramInvoicepaymentsUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Print receipt"
                  icon="print"
                  onClick={()=>{downloadReceipt({invoiceId:(invoice_paymentsNode?.invoice_key || '')})}}
                  />
                  
                </>
              )}
              
              {paramInvoicepaymentsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="InvoicepaymentsMainProfilePage"
                tableName="invoice_payments"
                uptoken={paramInvoicepaymentsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="InvoicepaymentsMainProfilePage"
                tableName="invoice_payments"
                link="./profile"
                label=" Add payments "
                icon="plus-circle" />
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
            <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
              <div className="col-md-12 row justify-content-center p-0 m-0">
                <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                  <LiveSearchDropdown
                  apiEndpoint="/api/nextinvoice/docs/invoicelist"
                  tblName="invoices"
                  parentTable="invoice_payments"
                  inputName="txt__invoices_invoice_no_invoice_id"
                  hiddenInputName="txt_invoice_id"
                  valueField="invoice_id"
                  displayField="invoice_no"
                  label="Invoice number "
                  defaultValue={{ invoice_id: invoice_paymentsNode?.invoice_id || "", invoice_no: invoice_paymentsNode?._invoices_invoice_no_invoice_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>  console.log("Data seleted")}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-3 hive_data_cell "
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="invoice_payments"
                  field="date_paid"
                  label="Date Paid"
                  value={invoice_paymentsNode?.date_paid || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="invoice_payments"
                  field="amount_paid"
                  label="Amount Paid"
                  value={invoice_paymentsNode?.amount_paid || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <MosySmartField
                  module="invoice_payments"
                  field="ref_no"
                  label="Ref No"
                  value={invoice_paymentsNode?.ref_no || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3 hive_data_cell "}}
                  />
                  
                  
                  <div className="form-group col-md-3 hive_data_cell ">
                    <label className="d-none">Payment Mode</label>
                    
                    <SmartDropdown
                    apiEndpoint="/api/nextinvoice/payments/invoicepayments"
                    idField="primkey"
                    labelField="payment_mode"
                    inputName="txt_payment_mode"
                    label="Payment Mode"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={invoice_paymentsNode?.payment_mode || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="invoice_payments"
                  field="remark"
                  label="Remark"
                  value={invoice_paymentsNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="InvoicepaymentsMainProfilePage"
                  tblName="invoice_payments"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="invoice_payments_uptoken" name="invoice_payments_uptoken" value={paramInvoicepaymentsUptoken}/>
              <input type="hidden" id="invoice_payments_mosy_action" name="invoice_payments_mosy_action" value={invoicepaymentsActionStatus}/>
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
        {invoice_paymentsNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Invoice Payment history`} </h5>
            
            <InvoicepaymentsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : btoa(`where invoice_id ='${invoice_paymentsNode?.invoice_id}' `),
              customProfilePath:""
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateInvoicepaymentsEvent,
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

