import React, { useState, useEffect } from 'react';
import { Button, InputGroup, InputGroupAddon, Input, ListGroup
    , ListGroupItem, ListGroupItemHeading, ListGroupItemText
    , Alert, ButtonToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';  
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import '../resources/css/tms-ui.css';
import ToolTipCustom from './TMSToolTipCustom.jsx' 
import TMSEmailSearch from './TMSEmailSearch.jsx'
import { 
    getTMSCCRColumns,
    setTMSCCRCriteria,
    setTMSCCRSelectTable,
    setTMSCCRRunTime
} from '../actions/TMSActions'; 

var runTimeOptions = [
    {label: 'Daily', value: 'daily'},
    {label: 'Weekly', value: 'weekly'},
    {label: 'Quarterly', value: 'quarterly'}
]

var criteriaOptions = [{
    label: 'Equal', value: '=', type: 'string'
},{
    label: 'Greater or equal to', value: '>=', type: 'number'
},{
    label: 'Greater than', value: '>', type: 'number'
},{
    label: 'In', value: 'IN', type: 'string'
},{
    label: 'Less or equal to', value: '<=', type: 'number'
},{
    label: 'Less than', value: '<', type: 'number'
},{
    label: 'Like', value: 'LIKE', type: 'string'
},{
    label: 'Not like', value: 'NOT LIKE', type: 'string'
},{
    label: 'Not in', value: 'NOT IN', type: 'string'
},{
    label: 'Not equal', value: '!=', type: 'string'
}]

const ListTaskGroup = ({list}) => { 
    const dispatch = useDispatch();
    const deleteFilter = (e) => { 
        
        var nextIndex = parseInt(e.target.value) + 1;
        var prevIndex = parseInt(e.target.value) - 1; 
        if(nextIndex < list.length) {
            if(
                list[parseInt(e.target.value)].operator === 'AND'
                && list[nextIndex].operator === 'OR'
                && list[prevIndex].operator === 'OR'
            ){
                list[nextIndex].operator = 'AND';
            }
        }

        list.splice(e.target.value,1); 

        if(list.length > 0){
            list[0].operator = 'WHERE'
        } 
        list.forEach((item,index) => { 
            list[index].criteria_sequence = index;
            var prev = list[index - 1];
            var next = list[index + 1];
            if(typeof prev !== 'undefined'){
                list[index].parenthesis = '';
                if(item.operator === 'OR'){
                    
                    if(prev.operator === 'OR'){
                        prev.parenthesis = '';
                    } else {
                        prev.parenthesis = '(';
                    }

                    if(typeof next === 'undefined'){
                        list[index].parenthesis = ')';
                    } else {
                        list[index].parenthesis = (next.operation === 'OR') ? '' : ')';
                    }
                    
                }
            } else {
                list[index].parenthesis = '';
            }
        })

        dispatch(setTMSCCRCriteria(list));
    }

    let ListGroupApp = list.map((item,index) => {
        return (
            <InputGroup key={`in-where-clause-${index}`} className="flex-no-wrap">
                {
                    (item.operator === "OR") && 
                    <InputGroupAddon addonType="prepend">
                        <div className="flex-arrow-up"/>
                    </InputGroupAddon>
                }
                
                <ListGroupItem key={`lgi-where-clause-${index}`}> 
                    <ListGroupItemHeading className="list-heading">{item.operator}</ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {item.filter}
                    </ListGroupItemText> 
                </ListGroupItem >
                <InputGroupAddon addonType="append">
                    <Button color="danger" id={`ButtonDeleteFilter-${index}`} 
                        value={index}
                        onClick={deleteFilter}
                        className="button-delete-one" />  
                    <ToolTipCustom componentId={`ButtonDeleteFilter-${index}`} message={"Delete filter"}/>  
                </InputGroupAddon>
            </InputGroup>
             
        );
    }) 

    return(
        <ListGroup id="ListGroupAppFilter">
            {ListGroupApp}
        </ListGroup>
    );
}

const ButtonOr = ({onClick,disabled}) => {
    return (
        <div className="div-width" id="DivButtonOr">
            <Button disabled={disabled} id="ButtonOr" color="success" className="div-width" onClick={onClick}> 
                <FontAwesomeIcon icon={faGripLinesVertical} /> OR
            </Button>
            <ToolTipCustom componentId={"ButtonOr"} message={"Adds OR logical operator to previous AND logical operator filter."}/>
        </div>
    )
}

const InputSelection = ({obj,onChangeValue,onTogglePerc}) => {   

    var h = 65, t = 17; 
    
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

    var type = (obj.column_type === "number") ? "number" : "text";

    var showPerc = (obj.select_criteria.value === "NOT LIKE" || obj.select_criteria.value === "LIKE"); 

    return(
        <div className="div-width">
        {
            (obj.is_multi)  && <div className="div-width">
                <CreatableSelect id="SelectCriteriaValue" isDisabled={obj.disable_input_value} 
                    onKeyDown={(e) => {
                        // console.log(e.nativeEvent.code);
                        if(obj.column_type === "number") {
                            if (e.nativeEvent.code.indexOf('Digit') === -1 
                                &&  e.nativeEvent.code !== 'Minus'
                                &&  e.nativeEvent.code !== 'Period'
                                &&  e.nativeEvent.code !== 'Comma'
                                &&  e.nativeEvent.code !== 'Enter') {
                                e.preventDefault();
                            }
                        }
                    }}
                    className="react-select-style" isMulti={obj.is_multi} 
                    value={obj.value_input}
                    placeholder='Enter one or more values...'
                    onChange={(e) => onChangeValue(e,obj.is_multi)}
                    components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null}} 
                    noOptionsMessage={() => null}
                    styles={customStyles}/> 
                <ToolTipCustom componentId={"SelectCriteriaValue"} message={"Press Enter key to add values."}/> 
            </div>    
        }
        {
            (!obj.is_multi) && <div className="style-row">
                {
                    (showPerc) && <InputGroupAddon addonType="prepend" >
                        <ButtonToggle id="ButtonToggleLeftPerc" className={(obj.toggle_left_perc) ? "rectangle-shape perc-active" : "rectangle-shape perc-inactive"} active={obj.toggle_left_perc} value="toggle_left_perc" color="success" onClick={onTogglePerc}>%</ButtonToggle>
                        <ToolTipCustom componentId={"ButtonToggleLeftPerc"} message={"Add or remove % before input value."} placement="left"/>
                    </InputGroupAddon>
                }
                <Input disabled={obj.disable_input_value} className="rectangle-shape"
                    value={obj.value_input} 
                    type={type}
                    onChange={e => {onChangeValue(e,obj.is_multi)}} 
                    placeholder="Enter value..."/> 
                {
                    (showPerc) && <InputGroupAddon addonType="prepend" >
                        <ButtonToggle id="ButtonToggleRightPerc" className={(obj.toggle_right_perc) ? "rectangle-shape perc-active" : "rectangle-shape perc-inactive"} active={obj.toggle_right_perc} value="toggle_right_perc" color="success" onClick={onTogglePerc}>%</ButtonToggle>
                        <ToolTipCustom componentId={"ButtonToggleRightPerc"} message={"Add or remove % after input value."}/>
                    </InputGroupAddon>
                }
            </div>
        } 
        </div> 
                
    )
}

const TMSCreateCriteria = ({className}) => {
    const obj = {
        value_input: '',
        is_multi: false,
        criteria_values: [],
        select_criteria: '',
        tooltip_value: '...',
        column_type: 'string',
        disable_input_value: true,
        select_column: '',
        toggle_left_perc: true,
        toggle_right_perc: true, 
    }
    const dispatch = useDispatch();
    const table = [...useSelector(state => state.TmsReducer.TMSCCR.table)];
    const column = [...useSelector(state => state.TmsReducer.TMSCCR.column)];
    const savedCriteria = [...useSelector(state => state.TmsReducer.TMSCCR.criteria)];
    const selectedTable = useSelector(state => state.TmsReducer.TMSCCR.select_table);
    const runTime = useSelector(state => state.TmsReducer.TMSCCR.run_time);
    const [tmsCCRObj,setTmsCCRObj] = useState(obj);   

    useEffect(() => {
        var table = (typeof selectedTable.value !== 'undefined') ? selectedTable.value : '';
        dispatch(getTMSCCRColumns(table)); 
        // eslint-disable-next-line
    },[selectedTable])

    const onChangeTable = (e) => {  
        if(e.value !== selectedTable.value){ 
            var o = {...obj};
            dispatch(setTMSCCRSelectTable(e));
            dispatch(getTMSCCRColumns(e.value)); 
            setTmsCCRObj(o);
            dispatch(setTMSCCRCriteria([]));
        }
        
    }
    
    const onChangeColumn = (e) => {   
        var arr = criteriaOptions.filter((item) => {
                var v = (e.value.type === 'string') ? 'string' : 'number';
                return item.type === v || item.value === '=' 
                    || item.value === 'NOT IN' || item.value === 'IN'
                    || item.value === 'NOT LIKE' || item.value === 'LIKE'
            })
        var selectCriteria = '';
        setTmsCCRObj({...tmsCCRObj,
            select_criteria: selectCriteria,
            criteria_values: arr,
            select_column: e,
            is_multi: false,
            tooltip_value: `Selected column is a ${e.value.type} data type.`,
            column_type: e.value.type,
            disable_input_value: (selectCriteria.length === 0)
        }); 
    } 

    const onChangeCriteria = (e) => {  
        setTmsCCRObj({...tmsCCRObj,
            select_criteria: e,
            is_multi: (e.label === 'In' || e.label === 'Not in'),
            value_input: '',
            disable_input_value: (e.length === 0)
        });
    }

    const onChangeValue = (e,multi) => {
        var value = (multi) ? e : e.target.value;
        setTmsCCRObj({...tmsCCRObj, 
            value_input: value
        });
        
    }

    const onTogglePerc = (e) => {
        var o = {...tmsCCRObj};
        o[e.target.value] = !o[e.target.value] 
        setTmsCCRObj(o);
    }

    const onButtonClickOperator = (e,operator) => { 
        var valueInput = tmsCCRObj.value_input;
        var criteriaValue = tmsCCRObj.select_criteria.value;
        if(criteriaValue.toString().includes('LIKE')){
            valueInput = "'" + ((tmsCCRObj.toggle_left_perc) ? "%" : "") + valueInput + ((tmsCCRObj.toggle_right_perc) ? "%" : "") + "'"
        } 
        else if(Array.isArray(valueInput)){ 
            valueInput = "('" + valueInput.map((item) => {return item.value}).join("', '") + "')";
        }

        var filter = tmsCCRObj.select_column.value.column_name + " " + criteriaValue + " " + valueInput;
        operator = operator.toUpperCase();
        if(savedCriteria.length === 0){
            operator = 'WHERE';
        }
        savedCriteria.push({operator:operator,filter:filter,parenthesis:''});

        savedCriteria.forEach((item,index) => {  
            savedCriteria[index].criteria_sequence = index + 1;
            var prev = savedCriteria[index - 1];
            var next = savedCriteria[index + 1];
            if(typeof prev !== 'undefined'){
                if(item.operator === 'OR'){
                    
                    if(prev.operator === 'OR'){
                        prev.parenthesis = '';
                    } else {
                        prev.parenthesis = '(';
                    }

                    if(typeof next === 'undefined'){
                        savedCriteria[index].parenthesis = ')';
                    } else {
                        savedCriteria[index].parenthesis = (next.operation === 'OR') ? '' : ')';
                    }
                    
                }
            }
        })
        // console.log(savedCriteria);
        dispatch(setTMSCCRCriteria(savedCriteria));
        var o = {...obj}; 
        dispatch(setTMSCCRSelectTable(selectedTable));
        setTmsCCRObj(o);
    }

    

    // useEffect(() => { console.log('effect') });

    return (
        <div className={className}>
            <Alert color="primary" className="alert-message-note">
                Note: criteria checking will run every midnight server time and will execute depending on selected run time.
            </Alert> 
            <div className="style-row">                
                <div id="DivEmailCriteria" className="div-email">
                    <TMSEmailSearch id={"TaskGroupCriteriaFrom"} multi={false} title={"Who is the sender"} stateSelectedName={"from"} store={"criteria_store"} important={false}/>
                    <TMSEmailSearch id={"TaskGroupCriteriaTo"} multi={true} title={"Who are the recipients"} stateSelectedName={"to"} store={"criteria_store"} important={true}/>
                    <TMSEmailSearch id={"TaskGroupCriteriaCC"} multi={true} title={"Who are copied"} stateSelectedName={"cc"} store={"criteria_store"} important={true}/>
                </div>
                <div id="DivCriteriaSelection" className="style-column">
                    <InputGroup className="flex-no-wrap">
                        <InputGroupAddon addonType="prepend" className="">Table</InputGroupAddon>
                        <Select id="SelectTable" className="react-select-style" value={selectedTable}  options={table} onChange={onChangeTable}/> 
                        <ToolTipCustom componentId={"SelectTable"} message={"Only one table is allowed per critera. All selection will clear if table will change."}/>
                    </InputGroup>  
                    <InputGroup className="flex-no-wrap">
                        <InputGroupAddon addonType="prepend" className="">Column</InputGroupAddon>
                        <Select id="SelectColumn" className="react-select-style" value={tmsCCRObj.select_column} options={column} onChange={onChangeColumn}/> 
                        <ToolTipCustom componentId={"SelectColumn"} message={tmsCCRObj.tooltip_value}/> 
                    </InputGroup> 
                    <InputGroup className="flex-no-wrap">
                        <InputGroupAddon addonType="prepend" className="">Criteria</InputGroupAddon>
                        <Select id="SelectCriteria" className="react-select-style" value={tmsCCRObj.select_criteria} options={tmsCCRObj.criteria_values} onChange={onChangeCriteria}/> 
                    </InputGroup> 
                    <InputGroup className="flex-no-wrap" >
                        <InputGroupAddon addonType="prepend" className="">Value</InputGroupAddon>
                        <InputSelection obj={tmsCCRObj} onChangeValue={onChangeValue} onTogglePerc={onTogglePerc}/>
                    </InputGroup> 
                    <div className="style-row">
                        {(savedCriteria !==  null && savedCriteria.length > 0) && <ButtonOr disabled={(tmsCCRObj.value_input.length === 0)} onClick={(e) => {onButtonClickOperator(e,"OR")}}/>}
                        <Button id="ButtonAnd" color="primary" 
                            className="div-width"
                            disabled={(tmsCCRObj.value_input === null || tmsCCRObj.value_input.length === 0)}
                            onClick={(e) => {onButtonClickOperator(e,"AND")}}> 
                            <b>&</b> AND
                        </Button>
                        <ToolTipCustom componentId={"ButtonAnd"} message={"Adds AND logical operator to the whole filter."}/>
                    </div>
                </div> 

                <div id="DivCriteriaList" className="style-column">
                    <InputGroup className="flex-no-wrap">
                        <InputGroupAddon addonType="prepend" className="">Run time</InputGroupAddon>
                        <Select id="SelectRunTime" className="react-select-style" value={runTime}  options={runTimeOptions} onChange={(e)=> {dispatch(setTMSCCRRunTime(e))}}/> 
                        <ToolTipCustom componentId={"SelectRunTime"} message={"Default is weekly but user can choose other options."}/>
                    </InputGroup>
                    <InputGroupAddon addonType="prepend" className="max-w" >Criteria added list</InputGroupAddon> 
                    <div className="taskgroup-list"> 
                        <ListTaskGroup list={savedCriteria}/>
                    </div>     
                </div>
            </div>
        </div>
    );
}

export default TMSCreateCriteria;