import {  
    TMSESR_SET_OPEN_EMAIL_SEARCH,
    TMSESR_GET_LDAP_RESULT,
    TMSESR_SET_SEARCH_VALUE,
    TMSESR_SET_DISABLE_SEARCH_BUTTON,
    TMSESR_ADD_UMS_EMAIL,
    TMSESR_ADD_UMS_EMAIL_OPTIONS,
    TMSESR_SET_SELECTED_VALUE,
    TMSESR_SET_MODAL_VALUES,
    TMSESR_SET_MULTI_VALUE,
    TMSESR_RESET,
    TMSESR_GET_UMS_EMAIL
} from "../constants/TMSConstants";
 
const iniState = {
    open_email_search: false,
    disable_search_button: true,
    search_value: '', 
    select_key: '',
    is_multi: false,
    id: '',
    ums_email: [],
    ums_select_options:[],
    ldap_result: [],
    multi_value: [],
    selected_store: ''
}

const TMSEmailSearchReducer = ( state=iniState, action) => {
    switch(action.type) { 
        case TMSESR_SET_OPEN_EMAIL_SEARCH:
            return { ...state, open_email_search: action.payload};
        case TMSESR_GET_LDAP_RESULT:
            return { ...state, ldap_result: action.payload};
        case TMSESR_SET_SEARCH_VALUE:
            return { ...state, search_value: action.payload};
        case TMSESR_SET_DISABLE_SEARCH_BUTTON:
            return { ...state, disable_search_button: action.payload};
        case TMSESR_ADD_UMS_EMAIL:
            return { ...state, ums_email: action.payload};
        case TMSESR_ADD_UMS_EMAIL_OPTIONS:
            return { ...state, ums_select_options: action.payload};
        case TMSESR_SET_SELECTED_VALUE:
            return { ...state, [action.payload.store]: action.payload.value};
        case TMSESR_SET_MODAL_VALUES:
            return { ...state, select_key: action.payload.select_key
                , selected_store: action.payload.store
                , is_multi: action.payload.is_multi
                , id: action.payload.id};
        case TMSESR_SET_MULTI_VALUE:
            return { ...state, multi_value: action.payload}; 
        case TMSESR_GET_UMS_EMAIL:
            return { ...state, ums_email: action.payload}; 
        case TMSESR_RESET:
            return action.payload ; 
        default:
            return state;
    }
}

export default TMSEmailSearchReducer;