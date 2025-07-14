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
import { loadMessageoutboxListData, popDeleteDialog, InteprateMessageoutboxEvent  } from '../dataControl/MessageoutboxRequestHandler';

//state management
import { useMessageoutboxState } from '../dataControl/MessageoutboxStateManager';

//nextinvoice custom functions
//import { sendMessage } from '../../nextinvoice_custom_functions';

//list
import {TimelineCard } from '../../../components/ListLayout'

import { MosyLiveSearch } from '../../UiControl/customUI';

//export listimport {TimelineCard} from '../../../components/ListLayout'

export default function MessageoutboxList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../reminders/message",
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
  
  //manage Messageoutbox states
  const [stateItem, stateItemSetters] = useMessageoutboxState(settersOverrides);
  
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
    
    loadMessageoutboxListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  return (
    
    <div className="col-md-12 bg-white p-0 main_list_container  " style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"messaging", keyword:stateItem.messageoutboxQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Message OutBox </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_messaging" name="txt_messaging" className="custom-search-input form-control" placeholder="Search in Message OutBox "
          onChange={(e) => stateItemSetters.setMessageoutboxQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qmessaging_btn" name="qmessaging_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="MessageoutboxList"
            action="_search_invoice_/_ref_no"
            label=" Search invoice / ref no"
            icon="copy"
            onClick={()=>{
              MosyLiveSearch({
                api:'/api/nextinvoice/reminders/smsreminders',
                displayField:'ref_number',
                tableName:'messaging',
                actionName : 'mosyfilter',
                title:' Search invoice / ref no',
                actionData : {path: './smslist', router : router , qstr : `ref_number='{{ref_number}}'`, stateSetters : stateItemSetters}
              })
              
            }}
            />
            
            <a href="messages" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="MessageoutboxList" link={customProfilePath} label="New message " icon="edit" />
          </div>
        </div>
      </div> )}
      
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {stateItem.messageoutboxLoading ? (
          <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Message OutBox ...</h5>
        ) : stateItem.messageoutboxListData.length > 0 ? (
          stateItem.messageoutboxListData.map((listmessaging_result, index) => (
            
            <TimelineCard
            key={listmessaging_result.primkey}
            editLink={`${customProfilePath}?messaging_uptoken=${btoa(listmessaging_result.primkey)}`}
            node1={listmessaging_result.message_date}
            node2={listmessaging_result.message_details}
            node3={listmessaging_result.receiver_contacts}
            
            />
          ))
        ) : (
          
          
          <div className="col-md-12 text-center mt-4">
            <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no messaging records found</h6>
            
            <AddNewButton src="MessageoutboxList"  link={customProfilePath} label="New message " icon="edit" />
            <div className="col-md-12 pt-5 " id=""></div>
          </div>
        )}
        <MosyPaginationUi
        src="MessageoutboxList"
        tblName="messaging"
        totalPages={stateItem.messageoutboxListPageCount}
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

