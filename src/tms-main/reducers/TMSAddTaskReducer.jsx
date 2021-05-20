import { 
    TMSATR_SET_TASK_INFO,
    TMSATR_SET_APPLICATION_INFO,
    TMSATR_SET_TASK_GROUP_INFO,
    TMSATR_SET_TASKS
} from "../constants/TMSConstants";

const iniState = { 
    task_info: [],
    application_selection: [],
    task_group_info: [],
    tasks: []
} 
const TMSAddTaskReducer = (state=iniState,action) => {
    switch(action.type){  
        case TMSATR_SET_TASKS:
            return {...state,  
                tasks: action.payload}
        case TMSATR_SET_APPLICATION_INFO:
            return {...state,  
                application_selection: action.payload}
        case TMSATR_SET_TASK_INFO:
            return {...state,  
                task_info: action.payload}
        case TMSATR_SET_TASK_GROUP_INFO:
            return {...state,  
                task_group_info: action.payload}
        default:
            return state;
    }
}

export default TMSAddTaskReducer;