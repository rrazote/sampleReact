import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button, FormGroup, Input, InputGroupAddon, InputGroup
    , ListGroupItem, ListGroupItemHeading, ListGroupItemText, ListGroup 
    , InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faDoorOpen} from '@fortawesome/free-solid-svg-icons';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move'; 
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';

// import TMSCreateApplication from './TMSCreateApplication.jsx'
// import TMSCreateTaskGroup from './TMSCreateTaskGroup.jsx'
import ToolTipCustom from './TMSToolTipCustom.jsx' 
import IconNew from '../resources/images/new.svg';
import { 
    setTMSCARModal
    , setTMSCTTaskList
    , setTMSCTAppName 
    , setTMSCTTaskGroup
    , setTMSCTTaskName
    , setTMSCTTaskDesc
    , setTMSCTGRModal 
    , setTMSCTRTaskGroupList 
    , setTMSESUMSOptions
    , getTMSCTTaskPerGroup
    , mergeTMSCTTasks
    , setTMSCTDeletedTasks
    , openToast
    , resetTMSCT
    , setTMSMRObj
    } from '../actions/TMSActions';  
import IconProceedEdit from '../resources/images/proceed_edit.svg'; 


const SortableItem = SortableElement(({value,onClickDelete,onClickAddBack,onChangeIsMandatory
    ,onClickButtonEdit,onChangeNewTaskName,onClickButtonOK,onChangeNewTaskDesc}) =>   
    <ListGroup id={`ListGroupTasks-${value.index}`} className="tasks-list" key={`list-task-${value.index}`}>
        <InputGroup key={`input-group-task-list-${value.index}`}>
            <InputGroupAddon addonType="prepend" className="tasks-list-input-addon">
                <div className="div-list-index-mandatory">
                    <div className="div-list-sequence">
                        {(value.index + 1 ).toString() } 
                    </div>
                    <FormGroup check > 
                        <Input id={`CheckboxIsMandatory-${value.index}`} type="checkbox" className="list-is-mandatory" checked={(value.item.is_mandatory === "1")} value={value.index} onChange={onChangeIsMandatory}/>  
                        <ToolTipCustom componentId={`CheckboxIsMandatory-${value.index}`} message={"This indicates if the task is mandatory or not. Check means mandatory."}/>   
                    </FormGroup>
                </div>
            </InputGroupAddon>
            
            <ListGroupItem className={`tasks-list-under ${(value.item.is_active === '0') ? 'deleted-on-list' : ''}`} id={`lgi-${value.index}`}> 
                <ListGroupItemHeading className="list-heading">
                    {(!value.item.edit) && value.item.task_name}
                    {(value.item.edit) && <Input id={`InputTaskName-${value.index}`} 
                    placeholder={value.item.task_name} onChange={(e) => {onChangeNewTaskName(e,value.index)}}/>}
                </ListGroupItemHeading>
                <ListGroupItemText className="list-body"> 
                    {(!value.item.edit) && value.item.task_desc}
                    {(value.item.edit) && <Input className={`textarea-list`} type="textarea" id={`InputTaskName-${value.index}`} placeholder={value.item.task_desc}
                        onChange={(e) => {onChangeNewTaskDesc(e,value.index)}}/>}
                </ListGroupItemText>               
            </ListGroupItem> 
            {
            (value.item.edit) && <InputGroupAddon addonType="append">
                <Button color="success" id={`ButtonSaveList-${value.index}`} className="button-save-one" onClick={(e) => {onClickButtonOK(e,value.index)}} value={value.index}/>  
                <ToolTipCustom componentId={`ButtonSaveList-${value.index}`} message={"Save changes."}/>  
            </InputGroupAddon>
            }

            {
            (value.item.edit) && <InputGroupAddon addonType="append">
                <Button color="danger" id={`ButtonCancelList-${value.index}`} className="button-cancel-one" onClick={onClickButtonEdit} value={value.index}/>  
                <ToolTipCustom componentId={`ButtonCancelList-${value.index}`} message={"Cancel changes."}/>  
            </InputGroupAddon>
            }
            
            {
            (!value.item.edit) && <InputGroupAddon addonType="append">
                <Button color="success" id={`ButtonEditList-${value.index}`} className="button-edit-one" onClick={onClickButtonEdit} value={value.index}/>  
                <ToolTipCustom componentId={`ButtonEditList-${value.index}`} message={"Edit task."}/>  
            </InputGroupAddon>
            }
           
            {
             (value.item.is_active === "1" && !value.item.edit) && <InputGroupAddon addonType="append">
                <Button color="danger" id={`ButtonDeleteList-${value.index}`} className="button-delete-one" onClick={onClickDelete} value={value.index}/>  
                <ToolTipCustom componentId={`ButtonDeleteList-${value.index}`} message={"Delete task."}/>  
            </InputGroupAddon>
            }
            
            {
            (value.item.is_active === "0" && !value.item.edit) && <InputGroupAddon addonType="append">
                <Button color="primary" id={`ButtonAddBackList-${value.index}`} className="button-enable-one" onClick={onClickAddBack} value={value.index}/>  
                <ToolTipCustom componentId={`ButtonAddBackList-${value.index}`} message={"Enable back the task."}/>  
            </InputGroupAddon>
            }
            
        </InputGroup>  
    </ListGroup>
);

const SortableList = SortableContainer(({items,cbDel}) => {   
    
    const dispatch = useDispatch(); 
    const onClickDelete = useCallback(e => cbDel(e),[cbDel]);  
    // const onClickAddBack = useCallback(e => cbBack(e),[cbBack]);  

    const enableBackTask = (e) => {
        items[e.target.value].is_active = 1;
        items[e.target.value].task_record_status = ''; 
        dispatch(setTMSCTTaskList(items)); 
    }
    
    const onChangeIsMandatory = (e) => { 
        items[e.target.value].is_mandatory = (e.target.checked) ? "1" : "0";
        dispatch(setTMSCTTaskList(items)); 
    }

    const onClickButtonEdit = (e) => {
        items[e.target.value].edit = !items[e.target.value].edit;
        dispatch(setTMSCTTaskList(items)); 
    }

    const onChangeNewTaskName = (e,index) => {
        items[index].new_task_name = e.target.value;  
    }

    const onChangeNewTaskDesc = (e,index) => {
        items[index].new_task_desc = e.target.value;  
    }
 
    var opts = {
        type: 'warning',
        title: 'Warning',
        message: 'Taskname should not be blank!',
        position: 'top',
        close_time: 3000
    }

    const onClickButtonOK = (e,index) => {
        if(typeof items[index].new_task_name !== 'undefined' 
            && items[index].new_task_name.length > 0){
            items[index].task_name = items[index].new_task_name;
            items[index].task_desc = (typeof items[index].new_task_desc !== 'undefined' 
                    && items[index].new_task_desc.length > 0) ? items[index].new_task_desc : items[index].task_desc;
            items[index].edit = false;
            // delete items[index].new_task_name;
            // delete items[index].new_task_desc;
            dispatch(setTMSCTTaskList(items)); 
        } else {
            dispatch(openToast({toast_opts:opts}))
        }
    } 
    return (
        <ul>
            {items.map((value, index) => (                   
                <SortableItem key={`item-${index}`} index={index} value={{item:value,index:index}} 
                    onClickDelete={onClickDelete} onClickAddBack={enableBackTask} onChangeIsMandatory={onChangeIsMandatory}
                    onClickButtonEdit={onClickButtonEdit} onChangeNewTaskName={onChangeNewTaskName}
                    onClickButtonOK={onClickButtonOK}
                    onChangeNewTaskDesc={onChangeNewTaskDesc} />
            ))}
        </ul>
    );
});

const ApplicationSelect = () => {     
    const dispatch = useDispatch();
    const appName = useSelector( state => state.TmsReducer.TMSCTR.application_name);  
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info); 
    var val = (appName === '') ? '' : {label: appName.app_name, value: appName};
    let options = [...useSelector( state => state.TmsReducer.TMSCAR.application_list)]
        .filter(v => {
            if(v.GROUP_NAME != null && userInfo.access === 'user'){
                return v.IS_ACTIVE === "1" && v.GROUP_NAME.split(';').some(r => userInfo.group_names.indexOf(r) > -1);
            } else {
                return v.IS_ACTIVE === "1";
            }
        })
        .map( v => ({value: {app_name:v.APPLICATION_NAME,app_id:v.ID}, label: v.APPLICATION_NAME}));  
    const onChangeSelectAppName = (e) => {
        dispatch(setTMSCTAppName((e === null) ? '' : e.value));
        dispatch(setTMSCTTaskGroup(''));
        dispatch(setTMSCTRTaskGroupList((e === null) ? '' : e.value));
        dispatch(setTMSCTTaskList([])); 
    }
    return (
        <InputGroup className="flex-no-wrap">
            <InputGroupAddon addonType="prepend" className="">Select an application</InputGroupAddon>
            <Select isClearable={true} options={options} id="InputAppName" className="react-select-style" 
                value={val}
                selectedOption={appName.app_name} 
                onChange={onChangeSelectAppName}/>            
            <InputGroupAddon addonType="append"> 
                <Button id="ButtonNewApplication" color="primary" className="button-new"
                    onClick={(e) => {dispatch(setTMSCARModal(true))} } >
                    <img src={IconNew} className="button-icon" alt=""/> 
                </Button>
                <ToolTipCustom componentId={"ButtonNewApplication"} message={"Create new application."}/> 
            </InputGroupAddon>
        </InputGroup>
    );
}

const TaskGroupSelect = () => { 
    const dispatch = useDispatch();
    const taskGroup = useSelector( state => state.TmsReducer.TMSCTR.task_group); 
    const disable = useSelector( state => state.TmsReducer.TMSCTR.disable_task_group);  
    const taskGroupList = useSelector( state => state.TmsReducer.TMSCTR.task_group_list);  
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info);  
    // console.log(taskGroupList);
    var options = [];
    if(userInfo.access === "admin") {
        options = taskGroupList.map(v => { 
            return({value:{task_group_name: v.task_group, task_group_id: v.task_group_id},label:v.task_group})
        }) 
    } else {
        options = taskGroupList.filter( v => v.system_generated === "0").map(v => { 
            return({value:{task_group_name: v.task_group, task_group_id: v.task_group_id},label:v.task_group})
        }) 
    }
    
    
    const onClickButtonOpenModal = () => {
        dispatch(setTMSESUMSOptions());
        dispatch(setTMSCTGRModal(true)); 
    }

    const onChangeTaskGroup = (e) => {
        dispatch(setTMSCTTaskGroup((e === null) ? '' : e));
        dispatch(getTMSCTTaskPerGroup((e === null) ? 0 : e.value.task_group_id));
    }
    return(
        <InputGroup className="flex-no-wrap">
            <InputGroupAddon addonType="prepend">Select task group</InputGroupAddon>
            <Select isClearable={true} isDisabled={disable}  options={options} id="InputTaskGroup" className="react-select-style" defaultValue={""} 
                selectedOption={taskGroup} 
                value={taskGroup}
                onChange={onChangeTaskGroup}/>            
            <InputGroupAddon addonType="append"> 
                <Button id="ButtonNewTaskGroup" color="primary" className="button-new"
                    disabled={disable}
                    onClick={onClickButtonOpenModal}>
                    <img src={IconNew} className="button-icon" alt=""/> 
                </Button>
                <ToolTipCustom componentId={"ButtonNewTaskGroup"} message={"Create new task group under the selected application."}/>   
            </InputGroupAddon>
        </InputGroup>
    );
}

const ModalDeleteConfirmation = ({toggle,index}) => { 
    const dispatch = useDispatch();
    const list = useSelector( state => state.TmsReducer.TMSCTR.task_list); 
    const [open, setOpen] = useState(false);
    const isFirstRun = useRef(true); 
    useEffect(()=>{
        if(isFirstRun.current){
            isFirstRun.current = false;
        } else { 
            setOpen(true)
        }
    },[toggle])

    const onClickButtonProceed = () => {
        list[index].is_active = 0;
        list[index].task_record_status = 'DELETED';      
        dispatch(setTMSCTTaskList(list)); 
        setOpen(false);
    }

    return(
        <React.Fragment>
            <Modal isOpen={open} centered={true} backdrop={"static"}>
            <ModalHeader>Confirm</ModalHeader>
            <ModalBody className="style-column" id="ModalBodyAddStatus">
                 You are deleting a task that already have instances.
                 This will only disable the task and not delete it from the system.
                 Proceed?
            </ModalBody>
            <ModalFooter> 
                <Button color="success"  onClick={onClickButtonProceed}>
                    <FontAwesomeIcon icon={faSave} /> Proceed
                </Button>  
                <Button color="danger" onClick={()=>{setOpen(false)}}>
                    <FontAwesomeIcon icon={faDoorOpen} /> Cancel
                </Button> 
            </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}

const CreateTasks = () => {       
    const [isMandatory, setIsMandatory] = useState(true);    
    const [isModify,setIsModify] = useState(false);
    const [toggle,setToggle] = useState(false);
    const [index,setIndex] = useState(false);
    
    const dispatch = useDispatch();
    const list = useSelector( state => state.TmsReducer.TMSCTR.task_list);  
    const taskGroup = useSelector( state => state.TmsReducer.TMSCTR.task_group);
    const disTaskName = useSelector( state => state.TmsReducer.TMSCTR.disable_task_name);
    const taskName = useSelector( state => state.TmsReducer.TMSCTR.task_name);
    const disTaskDesc = useSelector( state => state.TmsReducer.TMSCTR.disable_task_desc);
    const taskDesc = useSelector( state => state.TmsReducer.TMSCTR.task_desc);
    const disTaskAdd = useSelector( state => state.TmsReducer.TMSCTR.disable_add_button);
    const disIsMandatory = useSelector( state => state.TmsReducer.TMSCTR.disable_is_mandatory);
    const invalidTask = useSelector( state => state.TmsReducer.TMSCTR.invalid_task);      
    var toggleCreateTasks =  useSelector( state => state.TmsReducer.TMSMR.obj.show_create_task);  
    
    useEffect(() => {
        setIsModify(list.some( v => v.task_id > 0));
        // eslint-disable-next-line 
    },[list.length] )

    const addTaskToList = (e) => {   

        list.push({ 
            task_id: 0,
            task_group_id:taskGroup.value.task_group_id,
            task_name:taskName,
            task_desc:taskDesc,
            is_mandatory: (isMandatory) ? "1" : "0",
            is_active:1,
            task_record_status: '',
            inst_data_cnt: 0,
            edit: false
        }); 
        // console.log(list);
        dispatch(setTMSCTTaskList(list)); 
        dispatch(setTMSCTTaskName('')); 
        dispatch(setTMSCTTaskDesc(''));   
        setIsMandatory(true);   
    };   

    const deleteTaskFromList = (e) => {  
        setIndex(e.target.value);
        if(list[e.target.value].inst_data_cnt > 0) {
            setToggle(!toggle);
        } else {
            if(list[e.target.value].task_id > 0) {
                dispatch(setTMSCTDeletedTasks(list[e.target.value]));
            }
            list.splice(e.target.value,1);     
            dispatch(setTMSCTTaskList(list)); 
        } 
    }         
    
    const onSortEnd = ({oldIndex, newIndex}) => { 
        dispatch(setTMSCTTaskList(arrayMove(list, oldIndex, newIndex)));  
    };    

    const onClickButtonCreateOrModify = () => {
        var opts = {
            type: 'warning',
            title: 'Warning',
            message: 'Please close the edit window on the task list.',
            position: 'top',
            close_time: 3000
        }
        if(list.some(v => v.edit)) {
            dispatch(openToast({toast_opts:opts}));
        } else {
            dispatch(mergeTMSCTTasks());
        }
        
    }

    const onClickButtonCancel = () => { 
        dispatch(resetTMSCT());
        dispatch(setTMSMRObj({obj:{},value:'home'}));
    }

    var title = (isModify) ? 'Modify Existing Tasks' : 'Create New Tasks'; 
    var titleClass = '' +  ((isModify) ? ' tms-modal-header-edit' : ''); 
    return (
        <Modal id="TMSModalHeader" className="tms-create-task-modal" isOpen={toggleCreateTasks} centered={true} backdrop={"static"}>
            <ModalHeader className={titleClass}>{title}</ModalHeader>
            <ModalBody className="style-column" id="ModalBodyCreateTasks">
            <div className="tms-create-task">  
                <ModalDeleteConfirmation toggle={toggle} index={index}/>               
                    <div className="app-task-group" >
                        <FormGroup className="form-group">  
                            <ApplicationSelect/>
                            <TaskGroupSelect/>                                    
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">Add task</InputGroupAddon>
                                <Input invalid={invalidTask} disabled={disTaskName} id="InputTaskName" placeholder="Enter the task name here..." value={taskName} onChange={e=> dispatch(setTMSCTTaskName(e.target.value))}/> 
                                <InputGroupAddon addonType="append">   
                                    <InputGroupText id="InputGroupTextIsMandatory" className="inputgrouptext-check-box-append"> 
                                        <Input id="CheckboxIsMandatory" type="checkbox" className="check-box-append" disabled={disIsMandatory} checked={isMandatory} onChange={(e) => setIsMandatory(e.target.checked)}/>  
                                        <ToolTipCustom componentId={"InputGroupTextIsMandatory"} message={"Check if this task is mandatory."}/>
                                    </InputGroupText>                       
                                    <Button id="ButtonAddTask" disabled={disTaskAdd} color="primary"  onClick={addTaskToList}>
                                        <FontAwesomeIcon icon={faPlus} />  
                                    </Button>
                                    <ToolTipCustom componentId={"ButtonAddTask"} message="Add task to the list."/>
                                </InputGroupAddon> 
                            </InputGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">Add task description</InputGroupAddon>
                                <Input disabled={disTaskDesc} id="TextAreaTaskDesc" type="textarea" placeholder="Enter a short description for the task." value={taskDesc} onChange={e => dispatch(setTMSCTTaskDesc(e.target.value))}/>                      
                            </InputGroup> 
                        </FormGroup> 
                        <FormGroup id="FormGroupTaskList">   
                            <InputGroupAddon addonType="prepend" className="max-w">Tasks added for this task group</InputGroupAddon>         
                            <div className="sortable-list">
                                <SortableList items={list} onSortEnd={onSortEnd} cbDel={deleteTaskFromList}/>
                            </div>
                        </FormGroup>   
                    </div>   
                    
            </div>
            </ModalBody>
            <ModalFooter id="TMSModalFooter">
                <div className="div-save-close">
                    {
                    (isModify) && <Button color="success" size="sm" className="main-buttons" 
                        onClick={onClickButtonCreateOrModify}>
                        <img id={`IconProceedEdit`} src={IconProceedEdit} className="button-icon" alt=""/>  Modify
                    </Button>
                    }
                    {
                    (!isModify) && <Button color="primary" size="sm" className="main-buttons" 
                        disabled={(list.length === 0)}
                        onClick={onClickButtonCreateOrModify}>
                        <img src={IconNew} className="button-icon"  alt=""/> Create
                    </Button>
                    }                
                    {' '}
                    <Button color="danger" size="sm" className="main-buttons" 
                        onClick={onClickButtonCancel}>
                        <FontAwesomeIcon icon={faDoorOpen} className="main-button-icon" />Cancel
                    </Button> 
                </div>
            </ModalFooter>
        </Modal>    
    );
}

export default CreateTasks;

// <CreateTaskList taskLists={taskLists}/>