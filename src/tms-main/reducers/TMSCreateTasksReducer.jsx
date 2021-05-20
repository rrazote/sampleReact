import { 
    TMSCT_SET_APPLICATION_NAME,
    TMSCT_SET_TASK_LIST,
    TMSCT_SET_DISABLE_TASK_GROUP,
    TMSCT_SET_TASK_GROUP,
    TMSCT_SET_DISABLE_TASK_NAME,
    TMSCT_SET_TASK_NAME,
    TMSCT_SET_DISABLE_TASK_DESC,
    TMSCT_SET_TASK_DESC,
    TMSCT_SET_DISABLE_ADD_BUTTON,
    TMSCT_SET_DISABLE_IS_MANDATORY,
    TMSCT_SET_TASKGROUP_LIST,
    TMSCT_SET_TASK_LIST_DELETED
} from "../constants/TMSConstants"; 

const iniState = {
    application_name: '',
    disable_task_group: true,
    task_group: '',
    disable_task_name: true,
    task_name: '',
    disable_task_desc: true,
    task_desc: '',
    disable_add_button: true,
    disable_is_mandatory: true,
    invalid_task: false,
    task_list: [],  
    task_list_deleted: [],
    task_group_list: []

}

const TMSCreateTasksReducer = (state = iniState, action) => {
    switch(action.type){
        case TMSCT_SET_TASK_LIST:
            return { ...state, task_list: action.payload.task_list}
        case TMSCT_SET_TASK_LIST_DELETED:
            return { ...state, task_list_deleted: action.payload}
        case TMSCT_SET_APPLICATION_NAME:
            return { ...state, application_name: action.payload.application_name} 
        case TMSCT_SET_DISABLE_TASK_GROUP:
            return { ...state, disable_task_group: action.payload.disable_task_group} 
        case TMSCT_SET_TASK_GROUP:
            return { ...state, task_group: action.payload.task_group} 
        case TMSCT_SET_DISABLE_TASK_NAME:
            return { ...state, disable_task_name: action.payload.disable_task_name} 
        case TMSCT_SET_TASK_NAME:
            return { ...state, task_name: action.payload.task_name} 
        case TMSCT_SET_DISABLE_TASK_DESC:
            return { ...state, disable_task_desc: action.payload.disable_task_desc}  
        case TMSCT_SET_TASK_DESC:
            return { ...state, task_desc: action.payload.task_desc}     
        case TMSCT_SET_DISABLE_ADD_BUTTON:
            return { ...state, disable_add_button: action.payload.disable_add_button, invalid_task: action.payload.invalid_task}
        case TMSCT_SET_DISABLE_IS_MANDATORY:
            return { ...state, disable_is_mandatory: action.payload.disable_is_mandatory}
        case TMSCT_SET_TASKGROUP_LIST:
            return { ...state, task_group_list: action.payload}  
        default:
            return state;
    }
}
export default TMSCreateTasksReducer;