import { 
    TMSTDTR_SET_SELECTED_ROW,
    TMSTDTR_SET_EDIT_DATE,
    TMSTDTR_GET_TASK_INFO,
    TMSTDTR_SELECTED_TASK_ROW,
    TMSTDTR_SET_TASK_INFO,
    TMSTDTR_SET_PREVIOUS_ID,
    TMSTDTR_SET_MERGE_DATA,
    TMSTDTR_SET_STATUS_SELECTION
} from "../constants/TMSConstants";


const iniState = {
    selected_row: {
        ROW_ID: 1,
        TASK_INST_ID: 0,
        DATA_CNT: 0
    }, 
    status_selection: [],
    previous_id: 0,
    edit_row: null,
    task_info: [],
    task_columns: [],
    selected_tasks: [],
    task_loading: true,
    merge_data: {
        selected_status: '',
        target_start_date: '',
        target_end_date: '',
        instance_id: 0
    }
    
}

const TMSTasksDataTableReducer = (state=iniState,action) => {
    switch(action.type){
        case TMSTDTR_SET_STATUS_SELECTION:
            return {...state, status_selection:action.payload}
        case TMSTDTR_SET_MERGE_DATA:
            return {...state, merge_data:action.payload}
        case TMSTDTR_SET_SELECTED_ROW:
            return {...state, selected_row:action.payload}
        case TMSTDTR_SET_PREVIOUS_ID:
            return {...state, previous_id:action.payload}
        case TMSTDTR_SET_EDIT_DATE:
            return {...state, 
                edit_row:action.payload.edit_row
            }
        case TMSTDTR_GET_TASK_INFO:
            return {...state,
                task_info: action.payload.task_info,
                task_columns: action.payload.task_columns,
                task_loading: action.payload.task_loading
            }
        case TMSTDTR_SET_TASK_INFO:
            return {...state,
                task_info: action.payload
            }
        case TMSTDTR_SELECTED_TASK_ROW:
            return {...state,
                selected_tasks: action.payload 
            }   
        default:
            return state;
    }
}

export default TMSTasksDataTableReducer;