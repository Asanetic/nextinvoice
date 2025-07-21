
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultBusinesslistStateDefaults = {

  //state management for list page
  businesslistListData : [],
  businesslistListPageCount : 1,
  businesslistLoading: true,  
  parentUseEffectKey : 'loadBusinesslistList',
  localEventSignature: 'loadBusinesslistList',
  businesslistQuerySearchStr: '',

  
  //for profile page
  companiesNode : {},
  businesslistActionStatus : 'add_companies',
  parambusinesslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  businesslistUptoken:'',
  businesslistNode : {},
  activeScrollId : 'BusinesslistProfileTray',
  
  //dataScript
  businesslistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useBusinesslistState(overrides = {}) {
  const combinedDefaults = { ...defaultBusinesslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

