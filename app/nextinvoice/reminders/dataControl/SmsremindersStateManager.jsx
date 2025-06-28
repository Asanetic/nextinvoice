
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSmsremindersStateDefaults = {

  //state management for list page
  smsremindersListData : [],
  smsremindersListPageCount : 1,
  smsremindersLoading: true,  
  parentUseEffectKey : 'loadSmsremindersList',
  localEventSignature: 'loadSmsremindersList',
  smsremindersQuerySearchStr: '',

  
  //for profile page
  messagingNode : {},
  smsremindersActionStatus : 'add_messaging',
  paramsmsremindersUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  smsremindersUptoken:'',
  smsremindersNode : {},
  
  //dataScript
  smsremindersCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSmsremindersState(overrides = {}) {
  const combinedDefaults = { ...defaultSmsremindersStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

