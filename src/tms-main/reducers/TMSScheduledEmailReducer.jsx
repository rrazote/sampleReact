import {  
    TMSSER_SET_WEEKLY_OPTION,
    TMSSER_SET_MONTHLY_OPTION,
    TMSSER_SET_QUARTER_OPTION,
    TMSSER_SET_SELECTED_SCHEDULE,
    TMSSER_RESET
} from "../constants/TMSConstants";


const iniState = {
    selected_schedule: 'weekly', 
    weekly_option: [],
    monthly_option: [],
    quarterly_option: {
        first_q: {
            before_days: 0,
            checked: false,
            quarter: 1
        },
        second_q: {
            before_days: 0,
            checked: false,
            quarter: 2
        },
        third_q: {
            before_days: 0,
            checked: false,
            quarter: 3
        },
        fourth_q: {
            before_days: 0,
            checked: false,
            quarter: 4
        }
    }
}


const TMSScheduledEmailReducer = ( state=iniState , action) => {
    switch (action.type) {
        case TMSSER_SET_WEEKLY_OPTION:
            return {...state,weekly_option: action.payload}
        case TMSSER_SET_MONTHLY_OPTION:
            return {...state,monthly_option: action.payload}
        case TMSSER_SET_QUARTER_OPTION:
            return {...state,quarterly_option: action.payload}
        case TMSSER_SET_SELECTED_SCHEDULE:
            return {...state,selected_schedule: action.payload}
        case TMSSER_RESET:
            return iniState;
        default:
            return state;
    }
        
}

export default TMSScheduledEmailReducer;