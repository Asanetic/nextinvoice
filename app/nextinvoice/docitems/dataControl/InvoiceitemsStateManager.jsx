
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultInvoiceitemsStateDefaults = {

  //state management for list page
  invoiceitemsListData : [],
  invoiceitemsListPageCount : 1,
  invoiceitemsLoading: true,  
  parentUseEffectKey : 'loadInvoiceitemsList',
  localEventSignature: 'loadInvoiceitemsList',
  invoiceitemsQuerySearchStr: '',

  
  //for profile page
  invoice_itemsNode : {},
  invoiceitemsActionStatus : 'add_invoice_items',
  paraminvoiceitemsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  invoiceitemsUptoken:'',
  invoiceitemsNode : {},
  activeScrollId : 'InvoiceitemsProfileTray',
  
  //dataScript
  invoiceitemsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useInvoiceitemsState(overrides = {}) {
  const combinedDefaults = { ...defaultInvoiceitemsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

