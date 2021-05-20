import { 
    TMSAAR_SET_UPLOAD_ARRAY,
    TMSAAR_SET_STATUS_SELECTION,
    TMSAAR_SET_STATUS_DATA,
    TMSAAR_SET_ACTION_DATA,
    TMSAAR_SET_SHOW_CREATE_STATUS
} from "../constants/TMSConstants";

const iniState = {
    upload_array: [1], 
    status_selection: [], 
    show_create_status: false,
    action_data: {
        action_id: 0,
        merge_type: '',
        task_name: '',
        task_subject: '',
        task_instance_id: 0,
        action_status: '',
        action_name: '', 
        action_comment: '',
        action_refresh: true
    },
    status_data: {
        id: 0,
        status: '',
        status_desc: '',
        status_type: '',
        old_status: '',
        is_active: 1,
        cur_status_info: []
    }
}

const TMSAddActionReducer = (state=iniState,action) => {
    switch(action.type){ 
        case TMSAAR_SET_SHOW_CREATE_STATUS:
            return {...state,
                show_create_status: action.payload}
        case TMSAAR_SET_UPLOAD_ARRAY:
            return {...state,
                upload_array: action.payload}
        case TMSAAR_SET_STATUS_SELECTION:
            return {...state, 
                status_selection: action.payload}
        case TMSAAR_SET_ACTION_DATA:
            return {...state,
                action_data: action.payload}
         case TMSAAR_SET_STATUS_DATA:
            return {...state,
                status_data: action.payload}
        default:
            return state;
    }
}

export default TMSAddActionReducer;