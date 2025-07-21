
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultProductandservicesStateDefaults = {

  //state management for list page
  productandservicesListData : [],
  productandservicesListPageCount : 1,
  productandservicesLoading: true,  
  parentUseEffectKey : 'loadProductandservicesList',
  localEventSignature: 'loadProductandservicesList',
  productandservicesQuerySearchStr: '',

  
  //for profile page
  inventoryNode : {},
  productandservicesActionStatus : 'add_inventory',
  paramproductandservicesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  productandservicesUptoken:'',
  productandservicesNode : {},
  activeScrollId : 'ProductandservicesProfileTray',
  
  //dataScript
  productandservicesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useProductandservicesState(overrides = {}) {
  const combinedDefaults = { ...defaultProductandservicesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

