import {   
    TMSMR_OPEN_TOAST,
    TMSMR_SET_OBJECT,
    TMSMR_OPEN_LOADING,
    TMSMR_REFRESH,
    TMSMR_RETURN_HOME,
    TMSMR_USER_INFO,
    TMSMR_GET_STATUS_DEFS,
    TMSMR_GET_GROUP_NAME,
    TMSMR_GET_CRITERIA_TABLES_COLUMNS
} from "../constants/TMSConstants";


const iniState = {
    status_defs: [],
    group_name: [],
    toast_open: false,
    toast_opts: {
        type: 'success',
        title: 'Success',
        message: 'Click successful!',
        position: 'top-right',
        close_time: 3000
    },
    open_loading: {
        open: false,
        text: 'Loading...'
    },
    refresh: 0,
    obj : {
        show_task_table: true,
        show_action_table: false,
        show_create_task: false, 
        show_add_task: false,
        show_button_add_task: true,
        show_button_create_task: true,
        show_button_home: false,
        show_button_action_table: false 
    },
    logged_user_info: {
        id: '',
        access: 'user',
        group_names: []
    },
    criteria_tables_columns: []
}


const TMSMainReducer = ( state=iniState , action) => {
    switch (action.type) {
         case TMSMR_GET_CRITERIA_TABLES_COLUMNS:
            return {...state,
                criteria_tables_columns: action.payload
            }
        case TMSMR_GET_GROUP_NAME:
            return {...state,
                group_name: action.payload
            }
        case TMSMR_GET_STATUS_DEFS:
            return {...state,
                status_defs: action.payload
            }
        case TMSMR_USER_INFO:
            return {...state,
                logged_user_info: action.payload
            }
        case TMSMR_OPEN_TOAST:
            return {...state,
                toast_open: action.payload.toast_open,
                toast_opts: action.payload.toast_opts
            } 
        case TMSMR_SET_OBJECT: 
            return {...state,
                obj: action.payload
            }
        case TMSMR_OPEN_LOADING: 
            return {...state,
                open_loading: action.payload
            }
        case TMSMR_REFRESH: 
            return {...state,
                refresh: state.refresh + 1
            }
        case TMSMR_RETURN_HOME:
            return {...state,
                obj: iniState.obj
            }
        default:
            return state;
    }
        
}

export default TMSMainReducer;