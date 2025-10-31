
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSystemsettingsStateDefaults = {

  //state management for list page
  systemsettingsListData : [],
  systemsettingsListPageCount : 1,
  systemsettingsLoading: true,  
  parentUseEffectKey : 'loadSystemsettingsList',
  localEventSignature: 'loadSystemsettingsList',
  systemsettingsQuerySearchStr: '',

  
  //for profile page
  account_urlsNode : {},
  systemsettingsActionStatus : 'add_account_urls',
  paramsystemsettingsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  systemsettingsUptoken:'',
  systemsettingsNode : {},
  activeScrollId : 'SystemsettingsProfileTray',
  
  //dataScript
  systemsettingsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSystemsettingsState(overrides = {}) {
  const combinedDefaults = { ...defaultSystemsettingsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

