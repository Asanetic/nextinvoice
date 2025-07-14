
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSalesscriptStateDefaults = {

  //state management for list page
  salesscriptListData : [],
  salesscriptListPageCount : 1,
  salesscriptLoading: true,  
  parentUseEffectKey : 'loadSalesscriptList',
  localEventSignature: 'loadSalesscriptList',
  salesscriptQuerySearchStr: '',

  
  //for profile page
  sales_scriptNode : {},
  salesscriptActionStatus : 'add_sales_script',
  paramsalesscriptUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  salesscriptUptoken:'',
  salesscriptNode : {},
  
  //dataScript
  salesscriptCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSalesscriptState(overrides = {}) {
  const combinedDefaults = { ...defaultSalesscriptStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

