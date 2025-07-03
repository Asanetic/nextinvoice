
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultMycompaniesStateDefaults = {

  //state management for list page
  mycompaniesListData : [],
  mycompaniesListPageCount : 1,
  mycompaniesLoading: true,  
  parentUseEffectKey : 'loadMycompaniesList',
  localEventSignature: 'loadMycompaniesList',
  mycompaniesQuerySearchStr: '',

  
  //for profile page
  companiesNode : {},
  mycompaniesActionStatus : 'add_companies',
  parammycompaniesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  mycompaniesUptoken:'',
  mycompaniesNode : {},
  
  //dataScript
  mycompaniesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useMycompaniesState(overrides = {}) {
  const combinedDefaults = { ...defaultMycompaniesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

