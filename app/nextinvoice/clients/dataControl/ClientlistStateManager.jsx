
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultClientlistStateDefaults = {

  //state management for list page
  clientlistListData : [],
  clientlistListPageCount : 1,
  clientlistLoading: true,  
  parentUseEffectKey : 'loadClientlistList',
  localEventSignature: 'loadClientlistList',
  clientlistQuerySearchStr: '',

  
  //for profile page
  clientsNode : {},
  clientlistActionStatus : 'add_clients',
  paramclientlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  clientlistUptoken:'',
  clientlistNode : {},
  
  //dataScript
  clientlistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useClientlistState(overrides = {}) {
  const combinedDefaults = { ...defaultClientlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

