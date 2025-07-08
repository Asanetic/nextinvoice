
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultQuotationlistStateDefaults = {

  //state management for list page
  quotationlistListData : [],
  quotationlistListPageCount : 1,
  quotationlistLoading: true,  
  parentUseEffectKey : 'loadQuotationlistList',
  localEventSignature: 'loadQuotationlistList',
  quotationlistQuerySearchStr: '',

  
  //for profile page
  invoicesNode : {},
  quotationlistActionStatus : 'add_invoices',
  paramquotationlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  quotationlistUptoken:'',
  quotationlistNode : {},
  
  //dataScript
  quotationlistCustomProfileQuery : '',
  invoiceitemsCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useQuotationlistState(overrides = {}) {
  const combinedDefaults = { ...defaultQuotationlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

