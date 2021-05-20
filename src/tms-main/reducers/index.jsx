
import TMSCAR from './TMSCreateApplicationReducer.jsx';
import TMSCTR from './TMSCreateTasksReducer.jsx';
import TMSCTGR from './TMSCreateTaskGroupReducer.jsx'; 
import TMSESR from './TMSEmailSearchReducer.jsx'; 
import TMSSER from './TMSScheduledEmailReducer.jsx';
import TMSCCR from './TMSCreateCriteriaReducer.jsx';
import TMSTDTR from './TMSTasksDataTableReducer.jsx';
import TMSMR from './TMSMainReducer.jsx';
import TMSADTR from './TMSActionDataTableReducer.jsx';
import TMSAAR from './TMSAddActionReducer.jsx';
import TMSATR from './TMSAddTaskReducer.jsx';
import TMSPPIAAR from './TMSPPIAddActionReducer.jsx';

import { combineReducers }  from 'redux';

const rootReducers = combineReducers({
    TMSCAR,
    TMSCTR,
    TMSCTGR,
    TMSESR,
    TMSSER,
    TMSCCR,
    TMSTDTR,
    TMSMR,
    TMSADTR,
    TMSAAR,
    TMSATR,
    TMSPPIAAR 
});
 
export default rootReducers;