
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultLeadfollowupStateDefaults = {

  //state management for list page
  leadfollowupListData : [],
  leadfollowupListPageCount : 1,
  leadfollowupLoading: true,  
  parentUseEffectKey : 'loadLeadfollowupList',
  localEventSignature: 'loadLeadfollowupList',
  leadfollowupQuerySearchStr: '',

  
  //for profile page
  lead_followupNode : {},
  leadfollowupActionStatus : 'add_lead_followup',
  paramleadfollowupUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  leadfollowupUptoken:'',
  leadfollowupNode : {},
  activeScrollId : 'LeadfollowupProfileTray',
  
  //dataScript
  leadfollowupCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useLeadfollowupState(overrides = {}) {
  const combinedDefaults = { ...defaultLeadfollowupStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

