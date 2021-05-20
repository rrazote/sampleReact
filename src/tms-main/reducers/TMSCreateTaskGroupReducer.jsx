import { 
    TMSCTGR_SET_MODAL_STATUS,
    TMSCTGR_SET_TASKGROUP_NAME,
    TMSCTGR_GET_TASKGROUP_INFO,
    TMSCTGR_SET_TASKGROUP_ID,
    TMSCTGR_SET_DATA_ENTRY,
    TMSCTGR_RESET
} from "../constants/TMSConstants";

const iniState = {
    open_modal: false,
    taskgroup_name: '',  
    task_group_id: 0,
    taskgroup_info: [],
    data_entry: {
        task_group_id: 0,
        task_group_name: '',
        app_id: '',
        task_group_desc: '',
        is_active: 1,
        is_public: 0,
        is_auto_email: 0,
        is_system: 0,
        with_criteria: 0, 
        is_daily: 0,
        is_weekly: 0,
        is_quarterly: 0,
        is_specific_dates: 0,
        weekly_date: '',
        specific_date: '',
        quarter: '',
        old_task_group_name: ''
    }
}

const TMSCreateTaskGroupReducer = ( state=iniState, action) => {
    switch(action.type) {
        case TMSCTGR_SET_MODAL_STATUS:
            return { ...state, open_modal: action.payload}; 
        case TMSCTGR_SET_TASKGROUP_NAME:
            return { ...state, taskgroup_name: action.payload}; 
        case TMSCTGR_GET_TASKGROUP_INFO:
            return { ...state, taskgroup_info: action.payload}; 
        case TMSCTGR_SET_TASKGROUP_ID:
            return { ...state, task_group_id: action.payload}; 
        case TMSCTGR_SET_DATA_ENTRY:
            return { ...state, data_entry: action.payload}; 
        case TMSCTGR_RESET:
            return { ...state, data_entry: iniState.data_entry, task_group_id:0}; 
        default:
            return state;
    }
}

export default TMSCreateTaskGroupReducer;