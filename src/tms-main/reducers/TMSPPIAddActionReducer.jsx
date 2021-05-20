import {  
    TMSPPIAAR_SET_SHOW_MODAL,
    TMSPPIAAR_SET_SHORTAGE_INFO
} from "../constants/TMSConstants";

const iniState = {
    toggle: false,
    shortage_info: {
        region: '',
        subcon: '',
        atss_id: '',
        material: '',
        as_of_date: ''
    }
}

const TMSPPIAddActionReducer = (state=iniState,action) => {
    switch(action.type){  
        case TMSPPIAAR_SET_SHOW_MODAL:
            return {...state,
                toggle: action.payload}
        case TMSPPIAAR_SET_SHORTAGE_INFO:
            return {...state,
                shortage_info: action.payload}        
        default:
            return state;
    }
}

export default TMSPPIAddActionReducer;