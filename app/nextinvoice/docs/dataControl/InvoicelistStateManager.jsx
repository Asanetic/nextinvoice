
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultInvoicelistStateDefaults = {

  //state management for list page
  invoicelistListData : [],
  invoicelistListPageCount : 1,
  invoicelistLoading: true,  
  parentUseEffectKey : 'loadInvoicelistList',
  localEventSignature: 'loadInvoicelistList',
  invoicelistQuerySearchStr: '',

  
  //for profile page
  invoicesNode : {},
  invoicelistActionStatus : 'add_invoices',
  paraminvoicelistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  invoicelistUptoken:'',
  invoicelistNode : {},
  activeScrollId : 'InvoicelistProfileTray',
  
  //dataScript
  invoicelistCustomProfileQuery : '',
  invoiceitemsCustomProfileQuery : ``,
invoicepaymentsCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useInvoicelistState(overrides = {}) {
  const combinedDefaults = { ...defaultInvoicelistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

