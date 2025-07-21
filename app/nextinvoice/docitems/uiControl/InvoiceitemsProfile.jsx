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
import { inteprateInvoiceitemsFormAction, invoiceitemsProfileData , popDeleteDialog, InteprateInvoiceitemsEvent } from '../dataControl/InvoiceitemsRequestHandler';

//state management
import { useInvoiceitemsState } from '../dataControl/InvoiceitemsStateManager';

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

import  InvoiceitemsList from './InvoiceitemsList';

// export profile

export default function InvoiceitemsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="InvoiceitemsMainProfilePage",
    parentProfileItemId = "InvoiceitemsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Invoiceitems states
  const [stateItem, stateItemSetters] = useInvoiceitemsState(settersOverrides);
  const invoice_itemsNode = stateItem.invoiceitemsNode
  
  // -- basic states --//
  const paramInvoiceitemsUptoken  = stateItem.invoiceitemsUptoken
  const invoiceitemsActionStatus = stateItem.invoiceitemsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setInvoiceitemsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postInvoiceitemsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateInvoiceitemsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postInvoiceitemsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("InvoiceitemsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    invoiceitemsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="InvoiceitemsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postInvoiceitemsFormData} encType="multipart/form-data" id="invoice_items_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {invoice_itemsNode?.primkey ? (  <span> Item / {invoice_itemsNode?._inventory_item_name_item_id || ""}</span> ) :(<span> Add item </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramInvoiceitemsUptoken && (
                  <DeleteButton
                  src="InvoiceitemsMainProfilePage"
                  tableName="invoice_items"
                  uptoken={paramInvoiceitemsUptoken}
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
                
                
                
                {paramInvoiceitemsUptoken && (
                  <>
                  
                </>
              )}
              
              {paramInvoiceitemsUptoken && showNavigationIsle && (
                <>
                
                <DeleteButton
                src="InvoiceitemsMainProfilePage"
                tableName="invoice_items"
                uptoken={paramInvoiceitemsUptoken}
                stateItemSetters={stateItemSetters}
                parentStateSetters={parentStateSetters}
                router={router}
                onDelete={popDeleteDialog}
                />
                
                
                <AddNewButton
                src="InvoiceitemsMainProfilePage"
                tableName="invoice_items"
                link="./profile"
                label="Add item "
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
            <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Item Details</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  <LiveSearchDropdown
                  apiEndpoint="/api/nextinvoice/pns/productandservices"
                  tblName="inventory"
                  parentTable="invoice_items"
                  inputName="txt__inventory_item_name_item_id"
                  hiddenInputName="txt_item_id"
                  valueField="record_id"
                  displayField="item_name"
                  label="Item name"
                  defaultValue={{ record_id: invoice_itemsNode?.item_id || "", item_name: invoice_itemsNode?._inventory_item_name_item_id || "" }}
                  onSelect={(id) => console.log("Just the ID:", id)}
                  onSelectFull={(dataRes) =>
                  {
                    
                    handleInputChange('txt_item_remark',(dataRes?.item_remark));
                    handleInputChange('txt_quantity','1');
                    handleInputChange('txt_rate',(dataRes?.rate));
                    handleInputChange('txt_item_name',(dataRes?.item_name));
                    
                  }}
                  onInputChange={handleInputChange}
                  defaultColSize="col-md-3"
                  context={{hostParent : hostParent}}
                  />
                  
                  <MosySmartField
                  module="invoice_items"
                  field="quantity"
                  label="Quantity"
                  value={invoice_itemsNode?.quantity || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3"}}
                  />
                  
                  
                  <MosySmartField
                  module="invoice_items"
                  field="rate"
                  label="Rate"
                  value={invoice_itemsNode?.rate || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="text"
                  cellOverrides={{additionalClass: "col-md-3"}}
                  />
                  
                  
                  {invoice_itemsNode?.primkey && (
                    <div className="form-group col-md-3 ">
                      <label >Row totals</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_totals" name="div_totals" placeholder="Row totals">{(Number(invoice_itemsNode?.rate)*Number(invoice_itemsNode?.quantity))}</div>
                    </div>)}
                    
                    <MosySmartField
                    module="invoice_items"
                    field="item_remark"
                    label="Description"
                    value={invoice_itemsNode?.item_remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center"></div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-start col-md-12 p-0 m-0 ">
                    <LiveSearchDropdown
                    apiEndpoint="/api/nextinvoice/docs/invoicelist"
                    tblName="invoices"
                    parentTable="invoice_items"
                    inputName="txt__invoices_invoice_no_invoice_id"
                    hiddenInputName="txt_invoice_id"
                    valueField="invoice_id"
                    displayField="invoice_no"
                    label="Invoice No."
                    defaultValue={{ invoice_id: invoice_itemsNode?.invoice_id || "", invoice_no: invoice_itemsNode?._invoices_invoice_no_invoice_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  console.log("Data seleted")}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-3 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <input className="form-control" id="txt_item_name" name="txt_item_name" value={invoice_itemsNode?.item_name || ""} placeholder="Item Name" type="hidden"/>
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="InvoiceitemsMainProfilePage"
                    tblName="invoice_items"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="invoice_items_uptoken" name="invoice_items_uptoken" value={paramInvoiceitemsUptoken}/>
                <input type="hidden" id="invoice_items_mosy_action" name="invoice_items_mosy_action" value={invoiceitemsActionStatus}/>
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
          {invoice_itemsNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Document items`} </h5>
              
              <InvoiceitemsList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : btoa(`where  invoice_id ='${invoice_itemsNode?.invoice_id}' `),
                customProfilePath:""
                
              }}
              
              dataOut={{
                setChildDataOut: InteprateInvoiceitemsEvent,
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

