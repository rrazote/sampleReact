import React, { useEffect, useRef, useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import ReactiveDataTable from 'reactive-tables'; 
import { Button, Input, InputGroup } from 'reactstrap'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons'; 
import Select from 'react-select';
import Moment from 'moment';

import NotifEmail from '../resources/images/mail.svg';
import NotifPublic from '../resources/images/public.svg';
import NotifCriteria from '../resources/images/criteria.svg';
import NotifSysGen from '../resources/images/system_generated.svg';
 
import ToolTipCustom from './TMSToolTipCustom.jsx' 
import { 
    setTMSTDTRSelectedRow,
    setTMSTDTREditDate,
    getTMSTDTRTaskInfo,
    selectTMSDTRTask,
    unSelectTMSDTRTask,
    updateTMSDTRSelectValues,
    updateTMSDTRTask, 
    setTMSMRObj,
    getTMSTDTRActionInfo,
    setTMSTDTRMergeData,
    mergeTMSATRTaskInstance
} from '../actions/TMSActions'; 

const CustomDatePicker = ({data}) => { 
    var type = data.type.replace('_dttm','_date'); 
    const dispatch = useDispatch();
    const [dateInput,setDateInput] = useState(Moment(data.value).format("YYYY-MM-DD"));
    const onChangeDate = (e) => { 
        dispatch(updateTMSDTRSelectValues({row_id:data.row_id,column:data.column,value: e.target.value}));
        setDateInput(e.target.value);
        dispatch(setTMSTDTRMergeData({[type]:e.target.value}));
    } 
    return(
        <InputGroup key={`${data.id}-date-${data.cell_index}`}>
            <Input type="date"
                name={`${data.id}-DatePicker-${data.cell_index}`}
                id={`${data.id}-DatePicker-${data.cell_index}`}
                value={dateInput} 
                onChange={onChangeDate}
                />
            <ToolTipCustom componentId={`${data.id}-DatePicker-${data.cell_index}`} message={"Select date."}/>
        </InputGroup>
    );
}

const scrollToRef = (ref,index) => { 
    if(ref.current !== null){   
        var win = document.getElementById('DivTMSTasks').querySelector("div.tableFrame"); 
        var h = (index === 1) ? 0 : ref.current.offsetTop - 100;
        win.scrollTo(ref.current.offsetLeft - 120, h)
    } 
}


const CustomRows = ({data, columns}) => {    
    const record = data;     
    const dispatch = useDispatch();
    const selectedRow = useSelector(state => state.TmsReducer.TMSTDTR.selected_row);
    const editRow = useSelector(state => state.TmsReducer.TMSTDTR.edit_row); 
    const statSelect = useSelector(state => state.TmsReducer.TMSTDTR.status_selection); 
    const homeObj = {...useSelector(state => state.TmsReducer.TMSMR.obj)};  
    const mergeData = {...useSelector(state => state.TmsReducer.TMSTDTR.merge_data)}; 
    var selectedStat = mergeData.selected_status;

    const myRef = useRef(null);
    var className = (data.ROW_ID===selectedRow.ROW_ID) ? "highlight" : "";

    className = (data.ROW_ID===editRow) ? "edit-highlight" : className;  
    const onEditRow = (e,rowData) => {   
        if(editRow === null || editRow === ''){  
            dispatch(setTMSTDTREditDate({edit_row:data.ROW_ID}));
            scrollToRef(myRef,data.ROW_ID);
            dispatch(selectTMSDTRTask(data));
        } 
    }

    const onClickActions = (value) => {
        dispatch(setTMSMRObj({obj:homeObj,value:value}));
    }

    const onClickShowActions = (value) => {
        dispatch(getTMSTDTRActionInfo({
            task_subject: data.TASK_SUBJECT,
            task_name: data.TASK_NAME,
            task_instance_id: data.TASK_INST_ID
        }));
        onClickActions(value);
    }

    const customStyles = {
        option: provided => ({
            ...provided,
            color: 'black'
        }),
        control: provided => ({
            ...provided,
            color: 'black'
        }),
        singleValue: provided => ({
            ...provided,
            color: 'black'
        })
    }
 
    const cells = columns.map((column,cellIndex) => { 
        var actionDataCnt = record.DATA_CNT; 
        let key = 'column-' + column.key;       
        if ( column.key === 'action'){  
            var win = document.getElementById('DivTMSTasks').querySelector("div.tableFrame");
            const onClickCancelEdit = () => {
                dispatch(setTMSTDTREditDate({edit_row:''}));
                dispatch(unSelectTMSDTRTask(data));         
                win.scrollTo(0,win.scrollTop);      
            }

            const onClickSaveEdit = () => {
                dispatch(updateTMSDTRTask(data.ROW_ID));
                win.scrollTo(0,win.scrollTop);
                var obj = {...mergeData};
                obj.instance_id = data.TASK_INST_ID;
                obj.status = obj.selected_status.label;
                obj.task_id = 0;
                delete obj.selected_status;
                if(obj.target_start_date === ''){
                    obj.target_start_date = data.TARGET_START_DTTM;
                }
                if(obj.target_end_date === ''){
                    obj.target_end_date = data.TARGET_END_DTTM;
                }
                var arr = [];
                arr.push(obj);
                dispatch(mergeTMSATRTaskInstance({
                    task_group_id: 0,
                    task_subject: '',
                    task_instance:arr
                }));
            }

            return <td key={key} id={`tdActionId-${data.ROW_ID}`} >  
                <div className="style-row">
                    {
                        (editRow !== data.ROW_ID) && <div>
                            <ToolTipCustom componentId={`tdActionId-${data.ROW_ID}`} 
                                message={`Click any cell to select row. Double click row or click on eye icon to show actions. Click on pencil icon to edit target and end date.`} 
                                placement={"bottom"}/>
                            <Button id={`TmsAddSubTasksButton-${data.ROW_ID}`} color="primary" size="sm" className="tms-buttons-table" onClick={()=>{onClickShowActions('add_action')}}>
                                <FontAwesomeIcon icon={faPlus}  id={`TmsAddSubTasksIcon-${data.ROW_ID}`}/> 
                                <ToolTipCustom componentId={`TmsAddSubTasksButton-${data.ROW_ID}`} message={`Add action to this task.`} placement={"top"}/>
                            </Button>                              
                            {'  '}
                            <Button id={`TmsViewActionButton-${data.ROW_ID}`} color="secondary" size="sm" className="tms-buttons-table" onClick={()=>{onClickShowActions(data.DATA_CNT === 0 ? 'add_action' : 'action_table')}}>
                                <FontAwesomeIcon icon={faEye}  id={`TmsViewActionIcon-${data.ROW_ID}`}/> 
                                <ToolTipCustom componentId={`TmsViewActionButton-${data.ROW_ID}`} message={`View actions of this task.`} placement={"top"}/>
                            </Button>                              
                            {'  '}
                            <Button id={`TmsEditTasksButton-${data.ROW_ID}`} color="success" size="sm" className="tms-buttons-table" onClick={(e) => onEditRow(e,data)}>
                                <FontAwesomeIcon icon={faPencilAlt}  id={`TmsEditTasksIcon-${data.ROW_ID}`}/> 
                            </Button>
                            
                        </div> 
                    }   
                    {
                    (editRow === data.ROW_ID) && <div className="div-row-update-icon">
                        <Button id={`TmsEditRowCheck-${cellIndex}`} color="success" size="sm" className="tms-buttons-table" 
                            onClick={onClickSaveEdit}>
                            <FontAwesomeIcon icon={faCheck}  id={`TmsEditRowCheckIcon-${cellIndex}`}/> 
                        </Button>  
                        <ToolTipCustom componentId={`TmsEditRowCheck-${cellIndex}`} message={`Apply changes.`}/>
                    </div>
                    } 
                    {
                    (editRow === data.ROW_ID) && <div>
                        <Button id={`TmsEditRowClose-${cellIndex}`} color="danger" size="sm" className="tms-buttons-table" 
                            onClick={onClickCancelEdit}>
                            <FontAwesomeIcon icon={faTimes}  id={`TmsEditRowCloseIcon-${cellIndex}`}/> 
                        </Button>  
                        <ToolTipCustom componentId={`TmsEditRowClose-${cellIndex}`} message={`Cancel changes.`}/>
                    </div>
                    }
                     
                </div>
                
            </td>
        } else if (column.key === 'notifications') {
            return <td key={key} >   
                <div className="notif-main-div">
                    <div className="notif-data-count" id={`ImgNotifDataCount-${cellIndex}`}>  
                        {actionDataCnt}            
                        <ToolTipCustom componentId={`ImgNotifDataCount-${cellIndex}`} message={"Number of actions on this task."}/>
                    </div> 
                {
                    (record.GROUP_AUTO_EMAIL > 0) && <div> 
                        <img id={`ImgNotifEmail-${cellIndex}`} src={NotifEmail} className="notif" alt=""/>
                        <ToolTipCustom componentId={`ImgNotifEmail-${cellIndex}`} message={"This taskgroup has an auto email."}/>         
                    </div> 
                }
                {
                    (record.GROUP_PUBLIC > 0) && <div> 
                        <img id={`ImgNotifPublic-${cellIndex}`} src={NotifPublic} className="notif" alt=""/>
                        <ToolTipCustom componentId={`ImgNotifPublic-${cellIndex}`} message={"This is from a public task group."}/>   
                    </div>
                }
                {
                    (record.GROUP_WITH_CRITERIA > 0) && <div> 
                        <img id={`ImgNotifCriteria-${cellIndex}`} src={NotifCriteria} className="notif" alt=""/> 
                        <ToolTipCustom componentId={`ImgNotifCriteria-${cellIndex}`} message={"This belong to a task group that has a criteria."}/>              
                    </div>
                }
                {
                    (record.SYSTEM_GENERATED > 0) && <div> 
                        <img id={`ImgNotifSysGen-${cellIndex}`} src={NotifSysGen} className="notif" alt=""/> 
                        <ToolTipCustom componentId={`ImgNotifSysGen-${cellIndex}`} message={"This belong to a taskgroup that are used for system automated process and cannot be deleted."}/>              
                    </div>
                }
                
                    
                </div>  
            </td>
        }
        else if (column.key === 'TARGET_START_DTTM' || column.key === 'TARGET_END_DTTM'){            
            return <td className="td-date-picker" key={key} >
                {(editRow !== data.ROW_ID) && record[column.key]} 
                {(editRow === data.ROW_ID) && <CustomDatePicker data={{type:column.key.toLowerCase(),id: column.key, cell_index:cellIndex, value:record[column.key], row_id:data.ROW_ID, column:column.key}}/>}
            </td>
        }
        else if (column.key === 'TASK_STATUS') {
            return <td ref={(column.key === 'TASK_STATUS') ? myRef : null} className="td-date-picker" key={key} >
                {(editRow !== data.ROW_ID) && record[column.key]} 
                {(editRow === data.ROW_ID) && (data.TASK_STATUS !== 'FINISHED') && <Select 
                    styles={customStyles} 
                    options={statSelect}
                    value={selectedStat}
                    onChange={(e)=>{dispatch(setTMSTDTRMergeData({selected_status:e}))}}
                    />}
            </td>
        }
        else if (column.key === 'ACTUAL_END_DTTM' || column.key === 'ACTUAL_START_DTTM') {
            var dateString = null;
            if(record[column.key] !== null){
                var m = new Date(record[column.key]);
                dateString = m.getFullYear() + "/" +
                    ("0" + (m.getMonth()+1)).slice(-2) + "/" +
                    ("0" + m.getDate()).slice(-2) + " " +
                    ("0" + m.getHours()).slice(-2) + ":" +
                    ("0" + m.getMinutes()).slice(-2) + ":" +
                    ("0" + m.getSeconds()).slice(-2);
            }
            
            return <td key={key} >{dateString}</td>
        }
        else { 
            return <td key={key}  className={`${className}`}>
                {record[column.key]}
            </td>
        }
    });
    
   

    return (
        <tr id={`trRowId-${data.ROW_ID}`} className={className} 
            onClick={() => {dispatch(setTMSTDTRSelectedRow({ROW_ID: data.ROW_ID, TASK_INST_ID: data.TASK_INST_ID, DATA_CNT: data.DATA_CNT}))}}
            onDoubleClick={()=>{onClickShowActions(data.DATA_CNT === 0 ? 'add_action' : 'action_table')}}>
            {cells}
        </tr>
    );
}

const TMSTasksDataTable = () => {
    const [results, setResults] = useState([]);
    const [stopEffect,setStopEffect] = useState(0);
    // const [isLoading, setIsLoading] = useState(true); 
    const [columnHeaders, setColumnHeaders] = useState([]);
    const dispatch = useDispatch();
    const dbRes = [...useSelector(state => state.TmsReducer.TMSTDTR.task_info)];
    var taskLoaded = useSelector(state => state.TmsReducer.TMSTDTR.task_loading);
    const columns = useSelector(state => state.TmsReducer.TMSTDTR.task_columns); 
    const userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info); 
    const isFirstRun = useRef(true); 
    useEffect(() => {    
        if(isFirstRun.current && userInfo.id !== ''){
            isFirstRun.current = false;
            dispatch(getTMSTDTRTaskInfo());
        }
        
        setColumnHeaders(columns);
        setResults(dbRes);
        setStopEffect(1);  
        // setIsLoading(taskLoaded); 
        // eslint-disable-next-line
    },[stopEffect,dbRes.length,userInfo.id,taskLoaded]);   
 
    return ( 
        <ReactiveDataTable 
            showSpinner={taskLoaded}
            columns={columnHeaders}
            data={results}
            striped
            columnFilters
            row={CustomRows}
            size={100}
            disableDownload={true}
            actionColumns={["action","notifications"]} 
            /> 
    );
}

export default TMSTasksDataTable;