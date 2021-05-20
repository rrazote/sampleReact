import React, { useState } from 'react';
import { InputGroup, InputGroupAddon,
    Input, ListGroupItem, ListGroupItemHeading,
    ListGroupItemText, ListGroup, Button,
    Modal, ModalHeader, ModalBody, ModalFooter
 } from 'reactstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
import { useSelector, useDispatch } from 'react-redux';

import TMSRequiredAddOn from './TMSRequiredAddOn.jsx' 
import TMSEmailSearch from './TMSEmailSearch.jsx'
import {   
    setTMSMRObj,
    setTMSATRTaskGroupInfo,
    setTMSATRTasks,
    mergeTMSATRTaskInstance
} from '../actions/TMSActions'; 

const ListTask = ({list}) => {
    var tasks = [...useSelector(state => state.TmsReducer.TMSATR.tasks)];
    const dispatch = useDispatch();
    const onChangeDate = (value,index,type) => {
        tasks[index][type] = value;
        dispatch(setTMSATRTasks(tasks));
    }

     let Task = list.map((item,index) => {
        return (
            <InputGroup className="flex-no-wrap" key={`add-task-list-${index}`}>
                <ListGroupItem > 
                    <ListGroupItemHeading className="list-heading">{item.TASK_NAME}</ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {item.TASK_DESC}
                    </ListGroupItemText> 
                </ListGroupItem >
                <InputGroupAddon addonType="append">
                    <div className="date-div">
                        <div className="date-title">Target Start Date</div>
                        <Input type="date" className="date-on-list" onChange={(e) => {onChangeDate(e.target.value,index,'TARGET_START_DATE')}}/>
                    </div>
                    <div className="date-div">
                        <div className="date-title">Target End Date</div>
                        <Input type="date" className="date-on-list" onChange={(e) => {onChangeDate(e.target.value,index,'TARGET_END_DATE')}}/>
                    </div>
                </InputGroupAddon>
                
            </InputGroup>
        );
    }) 

    return(
        <ListGroup>
            {Task}
        </ListGroup>
    );
}

const TMSAddTask = () => {
    var application = [...useSelector(state => state.TmsReducer.TMSATR.application_selection)];
    var taskInfo = [...useSelector(state => state.TmsReducer.TMSATR.task_info)];
    var taskGroupInfo = [...useSelector(state => state.TmsReducer.TMSATR.task_group_info)];
    var tasks = [...useSelector(state => state.TmsReducer.TMSATR.tasks)]; 
    var toggleAddTasks =  useSelector( state => state.TmsReducer.TMSMR.obj.show_add_task);  
    const homeObj = {...useSelector(state => state.TmsReducer.TMSMR.obj)}; 
    const dispatch = useDispatch();
    const [taskObj,setTaskObj] = useState({   
        task_group_selected: '',
        application_selected: '', 
        task_subject: ''
    });  

    const onChangeApplication = (e) => { 
        var obj = {...taskObj}; 
        var val = '';
        if(e !== null) {
            dispatch(setTMSATRTaskGroupInfo(e.value.app_id)); 
            val = e.value;
        } else {
            obj.task_subject = '';
            dispatch(setTMSATRTasks([]));
        }
        setTaskObj({...obj, task_group_selected:'', application_selected:val});
    }

    const onChangeTaskGroup = (e) => {
        var obj = {...taskObj};
        var arr = [];
        if(e !== null) {
            arr = [...taskInfo].filter( v => v.TASK_GROUP_ID === e.value.task_group_id);
        } 
        dispatch(setTMSATRTasks(arr));
        setTaskObj({...obj, task_group_selected:e});
    }

    const onChangeTaskSubject = (e) => {
        var obj = {...taskObj};
        setTaskObj({...obj, task_subject:e.target.value});
    }

    const onButtonClickClose = () => {
        dispatch(setTMSMRObj({obj:homeObj,value:'close_task'}));
    }

    const onButtonClickAdd = () => {

        // convert to lower case
        var lowerTasks = [];
        // check date to generate status
        var now = new Date();
        tasks.forEach((item) => {
            var objTasks = {}; 
            objTasks.instance_id = 0;
            objTasks.task_id = item.TASK_ID;
            objTasks.target_start_date = item.TARGET_START_DATE;
            objTasks.target_end_date = item.TARGET_END_DATE;
            objTasks.status = 'WAITING';
            // set status for each tasks
            if(item.TARGET_START_DATE !== null && item.TARGET_START_DATE !== '') {
                var statusDate = new Date(item.TARGET_START_DATE);
                if(now >= statusDate) {
                    objTasks.status = 'STARTED';
                }
            } 

            lowerTasks.push(objTasks);
        })

        var obj = { 
            task_group_id: taskObj.task_group_selected.value.task_group_id,
            task_subject: taskObj.task_subject,
            task_instance: lowerTasks
        }; 
        dispatch(mergeTMSATRTaskInstance(obj));
        setTaskObj({...taskObj,
            task_group_selected: '', 
            task_subject: ''
        })
    }

    return (
        <Modal id="TMSModalHeader" className="tms-add-task-modal" isOpen={toggleAddTasks} centered={true} backdrop={"static"}>
            <ModalHeader>ADD TO MY TASKS</ModalHeader>
            <ModalBody id="ModalBodyAddTask">
                <div id="DivAddTask"> 
                    <div id="DivBodyAddTask" className="style-row">
                        <div className="left-info">
                            <InputGroup className="flex-no-wrap">
                                <TMSRequiredAddOn text={"Select an application"}/>
                                <Select isClearable={true} options={application} id="InputTaskAppName" className="react-select-style" defaultValue={""}  
                                    onChange={onChangeApplication}/>
                            </InputGroup>
                            <InputGroup className="flex-no-wrap">
                                <TMSRequiredAddOn text={"Select a task group"}/>
                                <Select isClearable={true} options={taskGroupInfo} id="InputTaskGroupName" className="react-select-style" 
                                    value={taskObj.task_group_selected}
                                    defaultValue={""}  
                                    isDisabled={(taskObj.application_selected === '')}
                                    onChange={onChangeTaskGroup}/>
                            </InputGroup>

                            <InputGroup className="flex-no-wrap">
                                <TMSRequiredAddOn text={"Task Subject"}/> 
                                <Input id="InputTaskSubject" name="task_subject" placeholder="Enter a task subject..." 
                                    value={taskObj.task_subject}
                                    disabled={(taskObj.task_group_selected === '')}
                                    onChange={onChangeTaskSubject}
                                    /> 
                            </InputGroup>
                            <TMSEmailSearch id={"AddTaskEmailTo"} multi={true} title={"Who are the recipients"} stateSelectedName={"to"} store={"add_task_email_store"} disabled={(taskObj.task_subject === '')}/>
                            <TMSEmailSearch id={"AddTaskEmailCC"} multi={true} title={"Who are copied"} stateSelectedName={"cc"} store={"add_task_email_store"} disabled={(taskObj.task_subject === '')}/>
                        </div>
                        <div className="right-info">
                            <InputGroupAddon addonType="prepend" className="max-w" >Tasks listed under task group</InputGroupAddon>         
                            <div className="task-list"> 
                                <ListTask list={tasks}/>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter id="TMSModalFooter">
                <div className="footer-buttons">
                    <Button color="primary" size="sm" className="main-buttons" 
                        disabled={(taskObj.task_group_selected === '' || taskObj.application_selected === '' || taskObj.task_subject === '')}
                        onClick={onButtonClickAdd}>
                        <FontAwesomeIcon icon={faSave} className="main-button-icon" />Add
                    </Button>
                    {' '}
                    <Button color="danger" size="sm" className="main-buttons"
                        onClick={onButtonClickClose}>
                        <FontAwesomeIcon icon={faDoorOpen} className="main-button-icon" />Close
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
        
        
    );
}

export default TMSAddTask;