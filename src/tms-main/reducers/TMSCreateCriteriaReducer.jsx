import {  
    TMSCCR_GET_TABLE_COLUMN,
    TMSCCR_GET_TABLE,
    TMSCCR_GET_COLUMN,
    TMSCCR_SET_CRITERIA,
    TMSCCR_SET_SELECT_TABLE,
    TMSCCR_SET_RUN_TIME,
    TMSCCR_RESET
} from "../constants/TMSConstants";

const iniState = {
    table_column: [],
    table:[],
    column:[],
    criteria:[],
    select_table: '',
    run_time: { label: 'Weekly', value: 'weekly'}
}

const TMSCreateCriteriaReducer = ( state=iniState, action) => {
    switch(action.type) { 
        case TMSCCR_GET_TABLE_COLUMN:
            return {...state,
                table_column: action.payload
            };
        case TMSCCR_GET_TABLE:
            return {...state,
                table: action.payload
            };
        case TMSCCR_GET_COLUMN:
            return {...state,
                column: action.payload
            };
        case TMSCCR_SET_CRITERIA:
            return {...state,
                criteria: action.payload
            };
        case TMSCCR_SET_SELECT_TABLE:
            return {...state,
                select_table: action.payload
            };
        case TMSCCR_SET_RUN_TIME:
            return {...state,
                run_time: action.payload
            };
        case TMSCCR_RESET:
            return action.payload;    
        default:
            return state;
    }
}

export default TMSCreateCriteriaReducer;