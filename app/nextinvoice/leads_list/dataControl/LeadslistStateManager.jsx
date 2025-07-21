
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultLeadslistStateDefaults = {

  //state management for list page
  leadslistListData : [],
  leadslistListPageCount : 1,
  leadslistLoading: true,  
  parentUseEffectKey : 'loadLeadslistList',
  localEventSignature: 'loadLeadslistList',
  leadslistQuerySearchStr: '',

  
  //for profile page
  leads_listNode : {},
  leadslistActionStatus : 'add_leads_list',
  paramleadslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  leadslistUptoken:'',
  leadslistNode : {},
  activeScrollId : 'LeadslistProfileTray',
  
  //dataScript
  leadslistCustomProfileQuery : '',
  leadfollowupCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useLeadslistState(overrides = {}) {
  const combinedDefaults = { ...defaultLeadslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

