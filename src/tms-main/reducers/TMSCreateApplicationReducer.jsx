import { 
    TMSCAR_SET_MODAL_STATUS,
    TMSCAR_SET_INVALID_APP_INPUT,
    TMSCAR_SET_DISABLE_CREATE,
    TMSCAR_GET_APPLICATION_LIST,
    TMSCAR_SET_APPLICATION_OBJ,
    TMSCAR_SET_APP_CUR_LIST,
    TMSCAR_SET_GROUP_NAME_CUR_LIST
} from "../constants/TMSConstants";
// import update from 'immutability-helper';
// update(state,{open_modal:{$set:action.payload}}); 
const iniState = {
    open_modal: false,
    invalid_app_input: false,
    disable_create: true,
    application_list: [],
    app_current_list: [],
    group_name_cur_list: [],
    obj: {
        app_name: '',
        app_url: '',
        app_id: 0,
        is_active: 1,
        group_name: []
    }
}
const TMSCreateApplicationReducer = (state = iniState, action) => {
    switch(action.type){
        case TMSCAR_SET_GROUP_NAME_CUR_LIST:
            return { ...state, group_name_cur_list: action.payload} 
        case TMSCAR_SET_MODAL_STATUS:
            return { ...state, open_modal: action.payload} 
        case TMSCAR_SET_INVALID_APP_INPUT:
            return { ...state, invalid_app_input: action.payload}
        case TMSCAR_SET_DISABLE_CREATE:
            return { ...state, disable_create: action.payload}
        case TMSCAR_GET_APPLICATION_LIST:
            return { ...state, application_list: action.payload}
        case TMSCAR_SET_APPLICATION_OBJ:
            return { ...state, obj: action.payload}
        case TMSCAR_SET_APP_CUR_LIST:
            return { ...state, app_current_list: action.payload}
        default:
            return state;
    }
}
export default TMSCreateApplicationReducer;