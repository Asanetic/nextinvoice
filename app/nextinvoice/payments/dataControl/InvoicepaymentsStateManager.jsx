
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultInvoicepaymentsStateDefaults = {

  //state management for list page
  invoicepaymentsListData : [],
  invoicepaymentsListPageCount : 1,
  invoicepaymentsLoading: true,  
  parentUseEffectKey : 'loadInvoicepaymentsList',
  localEventSignature: 'loadInvoicepaymentsList',
  invoicepaymentsQuerySearchStr: '',

  
  //for profile page
  invoice_paymentsNode : {},
  invoicepaymentsActionStatus : 'add_invoice_payments',
  paraminvoicepaymentsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  invoicepaymentsUptoken:'',
  invoicepaymentsNode : {},
  activeScrollId : 'InvoicepaymentsProfileTray',
  
  //dataScript
  invoicepaymentsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useInvoicepaymentsState(overrides = {}) {
  const combinedDefaults = { ...defaultInvoicepaymentsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

