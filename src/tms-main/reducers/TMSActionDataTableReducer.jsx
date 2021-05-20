import {
    TMSADTR_GET_ACTION_INFO,
    TMSADTR_FILTER_ACTION_INFO,
    TMSADTR_SET_DIALOG_DELETE,
    TMSADTR_SET_SHOW_FILE_LIST
} from "../constants/TMSConstants";

const iniState = {
    action_info: [],
    action_filtered: [],
    action_columns: [],
    action_show_file_list: {
        file_list: [],
        toggle: false
    },
    action_dialog_delete: {
        action_id: 0,
        toggle: false
    }
}

const TMSActionDataTableReducer = (state=iniState,action) => {
    switch(action.type){
        case TMSADTR_SET_SHOW_FILE_LIST:
            return {...state,
                action_show_file_list: action.payload
            }
        case TMSADTR_SET_DIALOG_DELETE:
            return {...state,
                action_dialog_delete: action.payload
            }
        case TMSADTR_GET_ACTION_INFO:
            return {...state,
                action_info: action.payload.action_info,
                action_columns: action.payload.action_columns
            }
        case TMSADTR_FILTER_ACTION_INFO:
            return {...state,action_filtered: action.payload}  
        default:
            return state;
    }
}

export default TMSActionDataTableReducer;