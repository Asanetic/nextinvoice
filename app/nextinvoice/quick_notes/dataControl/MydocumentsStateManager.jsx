
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultMydocumentsStateDefaults = {

  //state management for list page
  mydocumentsListData : [],
  mydocumentsListPageCount : 1,
  mydocumentsLoading: true,  
  parentUseEffectKey : 'loadMydocumentsList',
  localEventSignature: 'loadMydocumentsList',
  mydocumentsQuerySearchStr: '',

  
  //for profile page
  quick_notesNode : {},
  mydocumentsActionStatus : 'add_quick_notes',
  parammydocumentsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  mydocumentsUptoken:'',
  mydocumentsNode : {},
  
  //dataScript
  mydocumentsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useMydocumentsState(overrides = {}) {
  const combinedDefaults = { ...defaultMydocumentsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

