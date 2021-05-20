import React, { useState, useEffect } from 'react';
import { InputGroup, InputGroupAddon, Input, InputGroupText, Alert} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';  
import Select from 'react-select';
import Moment from 'moment';
import '../resources/css/tms-ui.css';
import { 
    setTMSSERWeeklyOptions,
    setTMSSERMonthlyOptions,
    setTMSSERQuarterlyOptions,
    setTMSSERSelectedSchedule
} from '../actions/TMSActions';  
import ToolTipCustom from './TMSToolTipCustom.jsx' 
import TMSEmailSearch from './TMSEmailSearch.jsx'

var runOption = [{name:'Weekly'},{name:'Select Date'},{name:'Quarterly'}];
var daily = ['All','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const WeeklyDay = ({item}) => { 
    const dispatch = useDispatch();
    var arr = [...new Set(useSelector( state => state.TmsReducer.TMSSER.weekly_option))];

    const onChangeWeeklyCheck = (e) => { 
        var v = e.target.value;
        var c = e.target.checked;
        if(c){
            if(v === "All"){
                arr = daily;
            } else {
                arr.push(v);
                if(arr.length === 7) {
                    arr.push("All");
                }
            }
        } else {
            if(v === "All"){
                arr = [];
            } else {
                var i = arr.indexOf("All");
                if(i > -1){
                    arr.splice(i,1);
                }
                i = arr.indexOf(v);
                if(i > -1){
                    arr.splice(i,1);
                }
            }
            
        }  
        dispatch(setTMSSERWeeklyOptions([...new Set(arr)])); 
    }

    let Day = item.map((day) => {
        return (
            <InputGroup className="flex-no-wrap" key={`weeklyday-${day}`}>
                <InputGroupAddon addonType="prepend" >{day}</InputGroupAddon>
                <InputGroupText className="checkbox-group">
                    <Input type="checkbox" className="checkbox-group-checkbox" checked={(arr.indexOf(day) > -1)} 
                        value={day} 
                        onChange={onChangeWeeklyCheck}/> 
                    <div className="checkbox-label"></div>
                </InputGroupText> 
            </InputGroup>
        );
    })

    return (
        <div className="style-row">
            {Day}
        </div>
    );                 
}

const WeeklyOption = () => {
    var arrWeek = [{partners:['All','Monday']}
        ,{partners:['Tuesday','Wednesday']}
        ,{partners:['Thursday','Friday']}
        ,{partners:['Saturday','Sunday']}];

    let DayPartners = arrWeek.map((item) => {  
        return (
            <WeeklyDay item={item.partners}/> 
        );
    })
    return (
        <div id="DivWeeklyOption" >
            {DayPartners}
        </div>
    );
}

const MonthlyOption = () => { 
    const mon = [];
    const dispatch = useDispatch(); 
    const [genDays,setGenDays] = useState([]);
    const [openMenu,setOpenMenu] = useState(false);
    const selectedDayMonths = [...useSelector( state => state.TmsReducer.TMSSER.monthly_option)];
    
    Moment.months().forEach((item)=>{
        mon.push({label:item,value:item})
    }) 
    const onChangeMonth = (e) => {        
        var now = new Date();
        var yearMon = now.getFullYear() + Moment().month(e.value).format("MM");
        var days = Moment(yearMon,"YYYYMM").daysInMonth(); 
        var shortMon = Moment().month(e.value).format("MMM");
        var dayOption = [];
        for(var i = 1; i <= days; i++){
            var day = ("0" + i.toString())
            var val = shortMon + "-" + day.substr(-2); 
            dayOption.push({label:val, value:val})
        } 
        setGenDays(dayOption);
    }

    const onChangeMonthDays = (e) => {  
        dispatch(setTMSSERMonthlyOptions(e)); 
    }

    var h = 146, t = 17;
    const customStyles = {
        valueContainer: base => ({
            ...base,
            height: h, 
            overflow: 'auto', 
            alignItems: 'start'
        }),
        placeholder: base => ({
            ...base,
            top: t
        })
    };

    return (
        <div id="DivMonthlyOption" className="style-column">
            <InputGroup className="flex-no-wrap"> 
                <InputGroupAddon addonType="prepend" className="">Select month</InputGroupAddon>
                <Select className="react-select-style" options={mon} placeholder="Select month..." onChange={onChangeMonth}/> 
            </InputGroup>
            <InputGroup className="flex-no-wrap"> 
                <InputGroupAddon addonType="prepend" className="">Select days</InputGroupAddon> 
                <Select className="react-select-style" isMulti={true} menuIsOpen={openMenu} onFocus={()=>{setOpenMenu(true)}}
                    onBlur={()=>{setOpenMenu(false)}}
                    styles={customStyles}
                    value={selectedDayMonths}
                    options={genDays} placeholder="Select one or more days..."
                    onChange={onChangeMonthDays}
                /> 
            </InputGroup>
        </div>
        
    );
}

const QuarterlyOption = () => {
    var quarters = [
        {value:'first_q',label:'1st'},
        {value:'second_q',label:'2nd'},
        {value:'third_q',label:'3rd'},
        {value:'fourth_q',label:'4th'}];  

    var obj = {...useSelector( state => state.TmsReducer.TMSSER.quarterly_option)};
    const dispatch = useDispatch(); 
    let QuarterComponents = quarters.map((item) => {
        const onChangeQuarterCheck = (e) => {
            
            obj[e.target.value]={...obj[e.target.value],
                checked: e.target.checked
            }; 
            dispatch(setTMSSERQuarterlyOptions(obj));
        }

        const onChangeDaysBefore = (e,obj_value) => {  
            var passObj = obj[obj_value]; 
            var i = e.target.value;  
            obj[obj_value]={...passObj,
                before_days: parseInt(i) > 60 ? 60 : parseInt(i)
            };  
            dispatch(setTMSSERQuarterlyOptions(obj));
        }

        return(
            <InputGroup className="flex-no-wrap" key={`input-group-${item.label}`}>
                <InputGroupAddon addonType="prepend" >{`${item.label} Quarter`}</InputGroupAddon>
                <InputGroupText className="checkbox-group">
                    <Input type="checkbox" className="checkbox-group-checkbox" checked={obj[item.value].checked} value={item.value} onChange={onChangeQuarterCheck}/> 
                </InputGroupText> 
                <InputGroupAddon addonType="append" >
                    <Input id={`daysBefore-${item.label}`} disabled={(!obj[item.value].checked)} min={0} max={60} type="number" step="1" value={obj[item.value].before_days} onChange={e => onChangeDaysBefore(e,item.value)}/>
                    <ToolTipCustom componentId={`daysBefore-${item.label}`} message={"Minimum of 0 and maximum of 60 days."}/> 
                </InputGroupAddon>
                <InputGroupAddon addonType="append" className="append-label">Enter how many days before trigger.</InputGroupAddon>
            </InputGroup>
            
        );
    })

    return(
        <div id="DivQuarterlyOption" className="style-column">
            {QuarterComponents}
        </div>
    );
}
 
const TMSScheduleEmail = ({className}) => { 
    const dispatch = useDispatch();
    let options = [];
    const selectedOption = useSelector( state => state.TmsReducer.TMSSER.selected_schedule);
    const [dateOption,setDateOption] = useState({label:runOption[0].name,value:runOption[0].name.toLowerCase()});
    
    useEffect(() => { 
        var selected = [...runOption]
            .filter(v => v.name.toLowerCase() === selectedOption)
            .map((v) => { return({label:v.name,value:v.name.toLowerCase()}) }); 
        setDateOption(selected[0]);
    },[selectedOption])

    runOption.forEach((item,index) => {
        options.push({label:item.name,value:item.name.toLowerCase()})
    })

    const onChangeRunOption = (e) => {
        setDateOption(e); 
        dispatch(setTMSSERSelectedSchedule(e.value));
    }

    return(
        <div className={className}>
            <Alert color="primary" className="alert-message-note">
                Note: auto email will run every midnight server time.
            </Alert> 
            <div className="style-row">                
                <div id="DivEmail" className="div-email">
                    <TMSEmailSearch id={"TaskGroupEmailFrom"} multi={false} title={"Who is the sender"} stateSelectedName={"from"} store={"schedule_email_store"} important={false}/>
                    <TMSEmailSearch id={"TaskGroupEmailTo"} multi={true} title={"Who are the recipients"} stateSelectedName={"to"} store={"schedule_email_store"} important={true}/>
                    <TMSEmailSearch id={"TaskGroupEmailCC"} multi={true} title={"Who are copied"} stateSelectedName={"cc"} store={"schedule_email_store"} important={true}/>
                </div>
                <div className="style-column">
                    <InputGroup className="flex-no-wrap">
                        <InputGroupAddon addonType="prepend" className="">How often it runs</InputGroupAddon>
                        <Select className="react-select-style" options={options} defaultValue={options[0]} value={dateOption} onChange={onChangeRunOption}/> 
                    </InputGroup>
                    { 
                        (dateOption.value === "weekly") && <WeeklyOption/> 
                    }
                    {
                        (dateOption.value === "select date") && <MonthlyOption/>
                    }
                    {
                        (dateOption.value === "quarterly") && <QuarterlyOption/>
                    }
                    
                </div> 
            </div>
            
        </div>
        
    );
}

export default TMSScheduleEmail;