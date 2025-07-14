'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam , magicRandomStr  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateQuotationlistFormAction, quotationlistProfileData , popDeleteDialog, InteprateQuotationlistEvent } from '../dataControl/QuotationlistRequestHandler';

//state management
import { useQuotationlistState } from '../dataControl/QuotationlistStateManager';

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
import { loadVendorHeaders, loadClientHeaders, downloadQuotation , genDocNo , convertToInvoice} from '../../nextinvoice_custom_functions';

//inv items
import  InvoiceitemsProfile from '../../docitems/uiControl/InvoiceitemsProfile';

import  InvoiceitemsList from '../../docitems/uiControl/InvoiceitemsList';

import {InteprateInvoiceitemsEvent} from '../../docitems/dataControl/InvoiceitemsRequestHandler';

//large text manager
import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'
import ReactMarkdown from 'react-markdown';


// export profile

export default function QuotationlistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="QuotationlistMainProfilePage"
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Quotationlist states
  const [stateItem, stateItemSetters] = useQuotationlistState(settersOverrides);
  const invoicesNode = stateItem.quotationlistNode
  
  // -- basic states --//
  const paramQuotationlistUptoken  = stateItem.quotationlistUptoken
  const quotationlistActionStatus = stateItem.quotationlistActionStatus
  const snackMessage = stateItem.snackMessage
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setQuotationlistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postQuotationlistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateQuotationlistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postQuotationlistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      mosyScrollTo("QuotationlistProfileTray")
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    quotationlistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo("QuotationlistProfileTray")
    
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setInvoiceitemsCustomProfileQuery Script
  const setInvoiceitemsCustomProfileQuery = stateItemSetters.setInvoiceitemsCustomProfileQuery;
  const invoiceitemsCustomProfileQuery =  stateItem.invoiceitemsCustomProfileQuery;
  
  useEffect(() => {
    if (invoicesNode?.primkey && setInvoiceitemsCustomProfileQuery) {
      
      const query = `where invoice_id ='${invoicesNode?.invoice_id}'   `;
      
      const tokenUrl = mosyUrlParam("invoice_items_uptoken")
      
      if(!tokenUrl)
      {
        setInvoiceitemsCustomProfileQuery(query);
      }
      
    }
  }, [invoicesNode, setInvoiceitemsCustomProfileQuery]);
  
  
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="QuotationlistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postQuotationlistFormData} encType="multipart/form-data" id="invoices_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {invoicesNode?.primkey ? (  <span> Quotation | {invoicesNode?.invoice_no || ""} </span> ) :(<span> Create quotation </span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramQuotationlistUptoken && (
                  <DeleteButton
                  src="QuotationlistMainProfilePage"
                  tableName="invoices"
                  uptoken={paramQuotationlistUptoken}
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
                
                {showNavigationIsle && ( <Link href="./quotations" className="text-info hive_profile_nav_back_to_list"><i className="fa fa-arrow-left"></i> Back to list</Link>)}
                
              </div>
              <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
                
                
                
                {paramQuotationlistUptoken && (
                  <>
                  
                  <MosyActionButton
                  label=" Print quotation"
                  icon="print"
                  onClick={()=>{downloadQuotation({invoiceId:(invoicesNode?.primkey || '')})}}
                  />
                  
                  <MosyActionButton
                  label=" Convert to invoice"
                  icon="copy"
                  onClick={()=>{
                    stateItemSetters.setQuotationlistActionStatus('add_invoices');
                    convertToInvoice(handleInputChange)}}
                    />
                    
                  </>
                )}
                
                {paramQuotationlistUptoken && showNavigationIsle && (
                  <>
                  
                  <DeleteButton
                  src="QuotationlistMainProfilePage"
                  tableName="invoices"
                  uptoken={paramQuotationlistUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  router={router}
                  onDelete={popDeleteDialog}
                  />
                  
                  
                  <AddNewButton
                  src="QuotationlistMainProfilePage"
                  tableName="invoices"
                  link="./quotation"
                  label="Create quotation "
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
                    <div className="col-md-5 text-center">Quotation Headers</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0 ">
                    <LiveSearchDropdown
                    apiEndpoint="/api/nextinvoice/clients/clientlist"
                    tblName="clients"
                    parentTable="invoices"
                    inputName="txt__clients_client_name_client_id"
                    hiddenInputName="txt_client_id"
                    valueField="client_id"
                    displayField="client_name"
                    label="Client name"
                    defaultValue={{ client_id: invoicesNode?.client_id || "", client_name: invoicesNode?._clients_client_name_client_id || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>
                    {
                      
                      handleInputChange('txt_client_headers',loadClientHeaders(dataRes));
                      handleInputChange('txt_client_tel',(dataRes?.client_tel));
                      handleInputChange('txt_client_email',(dataRes?.client_email));
                      
                    }}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    <LiveSearchDropdown
                    apiEndpoint="/api/nextinvoice/vendors/businesslist"
                    tblName="companies"
                    parentTable="invoices"
                    inputName="txt__companies_business_name_vendor_name"
                    hiddenInputName="txt_vendor_name"
                    valueField="company_id"
                    displayField="business_name"
                    label="Vendor Name"
                    defaultValue={{ company_id: invoicesNode?.vendor_name || "", business_name: invoicesNode?._companies_business_name_vendor_name || "" }}
                    onSelect={(id) => console.log("Just the ID:", id)}
                    onSelectFull={(dataRes) =>  {handleInputChange('txt_vendor_headers',loadVendorHeaders(dataRes))}}
                    onInputChange={handleInputChange}
                    defaultColSize="col-md-6 hive_data_cell "
                    context={{hostParent : hostParent}}
                    />
                    
                    <MosySmartField
                    module="invoices"
                    field="client_headers"
                    label="Client Headers"
                    value={invoicesNode?.client_headers || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                    />
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="vendor_headers"
                    label="Vendor Headers"
                    value={invoicesNode?.vendor_headers || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell"}}
                    />
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Quotation Letter</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0 ">
                    
                    <div className="form-group col-md-12">
                      <label >Quotation letter</label>
                      <MosyHtmlEditor
                      key={`reload - ${invoicesNode?.primkey}`}
                      module="invoices"
                      field="txt_footnote"
                      label="Quotation letter"
                      value={invoicesNode?.footnote || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="content_editable"
                      cellOverrides={{additionalClass: "d-none"}}
                      
                      />
                      <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="footnote_toprint">{invoicesNode?.footnote || ""}</div>
                      
                    </div>
                    
                  </div>
                  
                </div>
                
                <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                  <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                    <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                    <div className="col-md-5 text-center">Document Settings</div>
                    <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                  </h5>
                  
                  <div className="col-md-12 pt-3 p-0" id=""></div>
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0 ">
                    
                    <MosySmartField
                    module="invoices"
                    field="invoice_no"
                    label="Quotation Number"
                    value={(invoicesNode?.invoice_no || `QUOT/${magicRandomStr(5)}/${genDocNo()}`)}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="remark"
                    label="Remark"
                    value={invoicesNode?.remark || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Currency</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/nextinvoice/docs/quotationlist"
                      idField="primkey"
                      labelField="currency"
                      inputName="txt_currency"
                      label="Currency"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={invoicesNode?.currency || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="discount"
                    label="Discount"
                    value={invoicesNode?.discount || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <div className="form-group col-md-6 hive_data_cell ">
                      <label className="d-none">Folder</label>
                      
                      <SmartDropdown
                      apiEndpoint="/api/nextinvoice/docs/quotationlist"
                      idField="primkey"
                      labelField="folder"
                      inputName="txt_folder"
                      label="Folder"
                      onSelect={(val) => console.log('Selected:', val)}
                      defaultValue={invoicesNode?.folder || ""}
                      />
                    </div>
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="date_due"
                    label="Date Due"
                    value={invoicesNode?.date_due || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="date"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="client_tel"
                    label="Client Tel"
                    value={invoicesNode?.client_tel || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="client_email"
                    label="Client Email"
                    value={invoicesNode?.client_email || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                    />
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="invoice_type"
                    label="Invoice Type"
                    value={(invoicesNode?.invoice_type || `Quotation`)}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="text"
                    cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
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
                  
                  <div className="row justify-content-center col-md-12 p-0 m-0 ">
                    
                    <input className="form-control" id="txt_date_created" name="txt_date_created" value={invoicesNode?.date_created || ""} placeholder="Date Created" type="hidden"/>
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="QuotationlistMainProfilePage"
                    tblName="invoices"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="invoices_uptoken" name="invoices_uptoken" value={paramQuotationlistUptoken}/>
                <input type="hidden" id="invoices_mosy_action" name="invoices_mosy_action" value={quotationlistActionStatus}/>
              </section>
              
              
            </div>
            
          </form>
          
          
          <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
            {/*<hive_mini_list/>*/}
            
            {invoicesNode?.primkey && (
              <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage Items`} </h5>
                <InvoiceitemsProfile
                key={`${ invoiceitemsCustomProfileQuery}-${localEventSignature}`}
                dataIn={{
                  
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  customQueryStr : invoiceitemsCustomProfileQuery,
                  hostParent : "QuotationlistProfile",
                  customProfileData :
                  //invoice data
                  {
                    invoice_id : (invoicesNode?.invoice_id || ""),
                    
                  }
                  
                  
                  
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
  
