import React, { useState, useEffect } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter
    , InputGroup, InputGroupAddon, Input, FormGroup
    , ListGroup, ListGroupItem, InputGroupText
    , ListGroupItemHeading, ListGroupItemText
    , ButtonGroup
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import IconNew from '../resources/images/new.svg';
import Select from 'react-select';
import '../resources/css/tms-ui.css';
import {
    setTMSCTGRModal,
    getTMSCCRTableColumns,
    setTMSCTGRTaskGroupName,
    setTMSCARModal,
    setTMSCTAppName,
    setTMSCTTaskGroup,
    setTMSCTRTaskGroupList,
    mergeTMSCTGRTaskGroup,
    openToast,
    editTMSCTGRTaskGroup,
    setTMSCTGRDataEntry,
    resetTMSCTGR
} from '../actions/TMSActions';
import ToolTipCustom from './TMSToolTipCustom.jsx'
import TMSScheduleEmail from './TMSScheduleEmail.jsx'
import TMSCreateCriteria from './TMSCreateCriteria.jsx'
import TMSRequiredAddOn from './TMSRequiredAddOn.jsx'
import IconTaskList from '../resources/images/task-list.svg';
import IconSchedule from '../resources/images/schedule.svg';
import IconCriteria from '../resources/images/task-criteria.svg';
import IconEdit from '../resources/images/edit.svg';
import IconProceedEdit from '../resources/images/proceed_edit.svg';
import IconBack from '../resources/images/back.svg';

const ListTaskGroup = ({list}) => {
    const taskGroupId = useSelector(state => state.TmsReducer.TMSCTGR.task_group_id);
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info);
    const dispatch = useDispatch();
    // console.log(list);
    let ListGroupApp = list.map((item, index) => {
        const onClickButtonEditTaskGroup = () => {
            dispatch(editTMSCTGRTaskGroup(item.task_group_id))
        }

        // this is for system generated
        var showEdit = true;
        if (item.system_generated === "1") {
            if (userInfo.access === "admin") {
                showEdit = true;
            } else {
                showEdit = false;
            }
        }

        return (
            <InputGroup key={`ig-${item.task_group}`} className="flex-no-wrap">
                <ListGroupItem key={item.task_group}>
                    <ListGroupItemHeading className="list-heading">{item.task_group}</ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {item.task_group_desc}
                    </ListGroupItemText>
                </ListGroupItem >
                {
                    (taskGroupId === 0 && showEdit) && <InputGroupAddon addonType="append">
                        <Button color="success" id={`ButtonEditTaskGroup-${index}`}
                            onClick={onClickButtonEditTaskGroup}>
                            <img id={`IconEditTaskGroup-${index}`} src={IconEdit} className="button-icon" alt="" />
                            <ToolTipCustom componentId={`ButtonEditTaskGroup-${index}`} message={"Edit task group."} />
                        </Button>
                    </InputGroupAddon>
                }
            </InputGroup>
        );
    })

    return (
        <ListGroup>
            {ListGroupApp}
        </ListGroup>
    );
}

const CheckBoxCustom = ({disabled, componentId, onChange, checked, checkBoxTitle, checkBoxLabel, checkBoxToolTip}) => {
    // console.log(checked);
    if (typeof checked === undefined) {
        checked = false
    }
    const [cbValue, setCbValue] = useState(checked);
    useEffect(() => {
        setCbValue(checked);
    }, [checked])

    const onButtonCheckBoxClick = (e) => {
        setCbValue(!cbValue);
        onChange(!cbValue);
    }

    return (
        <InputGroup className="top-input">
            <InputGroupAddon addonType="prepend" className="checkbox-title">{checkBoxTitle}</InputGroupAddon>
            <InputGroupText className="checkbox-group">
                <Input disabled={disabled} type="checkbox" className="checkbox-group-checkbox" checked={cbValue} onChange={onButtonCheckBoxClick} />
                <Button disabled={disabled} id={componentId} className="button-checkbox" onClick={onButtonCheckBoxClick} outline={false}>
                    <div className="checkbox-label">{checkBoxLabel}</div>
                </Button>
                <ToolTipCustom componentId={componentId} message={checkBoxToolTip} />
            </InputGroupText>
        </InputGroup>
    )
}

const ApplicationSelect = () => {
    const dispatch = useDispatch();
    const appName = useSelector(state => state.TmsReducer.TMSCTR.application_name);
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info); 
    let options = [...useSelector(state => state.TmsReducer.TMSCAR.application_list)]
        .filter(v => {
            if(v.GROUP_NAME !== null && userInfo.access === 'user'){
                return v.IS_ACTIVE === "1" && v.GROUP_NAME.split(';').some(r => userInfo.group_names.indexOf(r) > -1);
            } else {
                return v.IS_ACTIVE === "1";
            }
        })
        .map(v => ({ value: { app_name: v.APPLICATION_NAME, app_id: v.ID }, label: v.APPLICATION_NAME }));
    const onChangeSelectAppName = (e) => {
        dispatch(setTMSCTRTaskGroupList(''));
        dispatch(setTMSCTAppName((e === null) ? '' : e.value));
        dispatch(setTMSCTTaskGroup(''));
        dispatch(setTMSCTRTaskGroupList((e === null) ? '' : e.value));
        dispatch(getTMSCCRTableColumns(e));
    }
    return (
        <InputGroup className="top-input">
            <TMSRequiredAddOn text={"Select an application"} />
            <Select isClearable={false} options={options} id="InputAppName" className="react-select-style"
                defaultValue={""}
                value={{ value: appName, label: appName.app_name }}
                selectedOption={appName.app_name}
                onChange={onChangeSelectAppName} />
            {
                (userInfo.access === 'admin') && <InputGroupAddon addonType="append">
                    <Button id="ButtonNewApplication" color="primary" className="button-new"
                        onClick={(e) => { dispatch(setTMSCARModal(true)) } } >
                        <img src={IconNew} className="button-icon" alt="" />
                    </Button>
                    <ToolTipCustom componentId={"ButtonNewApplication"} message={"Create new application."} />
                </InputGroupAddon>
            }
        </InputGroup>
    );
}

const TMSCreateTaskGroup = () => {
    var taskGroupList = [...useSelector(state => state.TmsReducer.TMSCTR.task_group_list)];
    var obj = {
        show_taskgroup: "style-row"
        , show_email: "hide-component"
        , show_criteria: "hide-component"
        , button_selected: "taskgroup"
        , checked_criteria: false
        , checked_email: false
        , button_group: ['taskgroup']
        , components: []
        , taskgroup_list: taskGroupList
        , disabled_next: true
    };
    const dispatch = useDispatch();
    const openModal = useSelector(state => state.TmsReducer.TMSCTGR.open_modal); 
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info);
    const appName = useSelector(state => state.TmsReducer.TMSCTR.application_name);
    const schedData = useSelector(state => state.TmsReducer.TMSSER);
    const critData = useSelector(state => state.TmsReducer.TMSCCR);
    const schedEmailStore = useSelector(state => state.TmsReducer.TMSESR.schedule_email_store);
    const critEmailStore = useSelector(state => state.TmsReducer.TMSESR.criteria_store);
    const dataEntry = useSelector(state => state.TmsReducer.TMSCTGR.data_entry);
    const [taskGroupObj, setTaskGroupObj] = useState({ ...obj });
    var open = useSelector(state => state.TmsReducer.TMSMR.toast_open);

    var modalTitle = "";
    if (dataEntry.task_group_id === 0) {
        if (taskGroupObj.button_selected === "taskgroup") {
            modalTitle = `Create new task group under ${appName.app_name}`
        } else if (taskGroupObj.button_selected === "email") {
            modalTitle = `Add new scheduled mail`
        } else if (taskGroupObj.button_selected === "criteria") {
            modalTitle = `Add new criteria`
        }
    } else {
        if (taskGroupObj.button_selected === "taskgroup") {
            modalTitle = `Modifying ${dataEntry.old_task_group_name} under ${appName.app_name}`
        } else if (taskGroupObj.button_selected === "email") {
            modalTitle = `Modifying scheduled mail for ${dataEntry.old_task_group_name}`
        } else if (taskGroupObj.button_selected === "criteria") {
            modalTitle = `Modifying criteria for ${dataEntry.old_task_group_name}`
        }
    }


    const toggle = () => {
        setTaskGroupObj({ ...obj });
        dispatch(setTMSCTGRModal(!openModal));
        dispatch(resetTMSCTGR());
    };
    // eslint-disable-next-line
    useEffect(() => {
        var o = { ...taskGroupObj };
        o.taskgroup_list = taskGroupList;
        o.disabled_next = (dataEntry.task_group_id === 0);
        o.checked_criteria = (dataEntry.with_criteria === 1);
        o.checked_email = (dataEntry.is_auto_email === 1);
        var bg = o.button_group;
        var comp = o.components;
        if (dataEntry.with_criteria === 1) {
            bg.push('criteria');
            comp.push('criteria');
        }
        if (dataEntry.is_auto_email === 1) {
            bg.push('email');
            comp.push('email');
        }
        o.button_group = bg;
        o.components = comp;
        setTaskGroupObj(o);

        // eslint-disable-next-line
    }, [taskGroupList[0], dataEntry.task_group_id])

    const onChangeShowDiv = (e, name) => {
        // set the value of the data entry
        var v = (e ? 1 : 0);
        var dE = { ...dataEntry };
        var oE = (name === 'email') ? 'is_auto_email' : 'with_criteria';
        dE[oE] = v;
        dispatch(setTMSCTGRDataEntry(dE));

        const changeObj = { ...taskGroupObj };
        const arr = changeObj.button_group;
        const comp = changeObj.components;
        var check = 'checked_' + name;
        if (comp.indexOf(name) === -1) {
            comp.push(name);
        }
        changeObj[check] = e;

        if (changeObj[check]) {
            arr.push(name);
        } else {
            arr.splice(arr.indexOf(name), 1);
        }

        var show = 'show_' + name;
        changeObj[show] = (changeObj[check]) ? "style-column" : "hide-component";

        // hide other components that are added
        comp.forEach((item) => {
            if (item !== name) {
                show = 'show_' + item;
                changeObj[show] = "hide-component";
            }
        })

        changeObj.components = comp;
        changeObj.button_group = arr;
        changeObj.show_taskgroup = (changeObj[check]) ? "hide-component" : "style-row";
        changeObj.button_selected = (e) ? name : 'taskgroup';
        setTaskGroupObj(changeObj);

    }

    const onClickShowDiv = (e, name) => {
        var show = 'show_' + name;
        taskGroupObj.show_taskgroup = "hide-component";
        if (name === "taskgroup") {
            taskGroupObj[show] = "style-row";
        } else {
            taskGroupObj[show] = "style-column";
        }

        var comp = [...taskGroupObj.components];
        comp.forEach((item) => {
            if (item !== name) {
                show = 'show_' + item;
                taskGroupObj[show] = "hide-component";
            }
        })

        setTaskGroupObj({
            ...taskGroupObj,
            button_selected: name
        });
    }

    const onChangeTaskGroupName = (e) => {
        // console.log(e);
        var v = e.target.value;
        var arr = [...taskGroupList];
        dispatch(setTMSCTGRTaskGroupName(v));

        var disable = arr.some(i => i.task_group.toLowerCase() === v.toLowerCase());
        var disableNext = false;
        if (dataEntry.task_group_id === 0) {
            disableNext = (disable || v.length === 0)
        } else {
            disableNext = v.length === 0;
        }

        setTaskGroupObj({
            ...taskGroupObj,
            taskgroup_list: arr.filter((item) => item.task_group.toLowerCase().includes(v.toLowerCase())),
            disabled_next: disableNext
        });
        dispatch(setTMSCTGRDataEntry({ ...dataEntry, task_group_name: v, app_id: appName.app_id }));
    }

    const onChangeIsSystem = (e) => {
        var v = (e.target.checked ? 1 : 0);
        if (dataEntry.task_group_id > 0) {
            var name = dataEntry.task_group_name;
            if (!e.target.checked) {
                name = name.replace('[AUTO] ', '');
            } else {
                name = '[AUTO] ' + name;
            }
            dataEntry.task_group_name = name;
        }

        dispatch(setTMSCTGRDataEntry({ ...dataEntry, is_system: v }));
    }

    const onChangeTaskGroupDesc = (e) => {
        var v = (e.target.value === null ? '' : e.target.value);
        dispatch(setTMSCTGRDataEntry({ ...dataEntry, task_group_desc: v }));
    }

    // const onChangeIsPublic = (e) => {
    //     var v = (e ? 1 : 0);
    //     dispatch(setTMSCTGRDataEntry({ ...dataEntry, is_public: v }));
    // }

    const onButtonClickCreateOrModify = () => {
        var proceed = true;
        var message = '';

        if (dataEntry.is_auto_email === 1) {
            if (schedData.selected_schedule === 'weekly') {
                proceed = (schedData.weekly_option.length > 0);
            } else if (schedData.selected_schedule === 'quarterly') {
                proceed = Object.values(schedData.quarterly_option).map(v => v.checked).some(v => v);
            } else if (schedData.selected_schedule === 'select date') {
                proceed = (schedData.monthly_option.length > 0);
            }

            if (proceed) {
                if (typeof schedEmailStore === undefined) {
                    proceed = false;
                } else {
                    if (schedEmailStore.to && schedEmailStore.cc) {
                        proceed = (schedEmailStore.to.length > 0 && schedEmailStore.cc.length > 0)
                    }
                }
            }

            if (!proceed) {
                message = 'Please fill in schedules and emails for scheduled email.';
            }
        }

        if (dataEntry.with_criteria === 1) {
            if (critData.criteria.length === 0) {
                proceed = false;
            }

            if (proceed) {
                if (typeof critEmailStore === undefined) {
                    proceed = false;
                } else {
                    if (critEmailStore.to && critEmailStore.cc) {
                        proceed = (critEmailStore.to.length > 0 && critEmailStore.cc.length > 0)
                    }
                }
            }

            if (!proceed) {
                message = 'Please add at least one criteria and fill in required items.';
            }
        }

        if (proceed) {
            dataEntry.task_group_name = String(dataEntry.task_group_name).trim();
            dispatch(mergeTMSCTGRTaskGroup(dataEntry));
            setTaskGroupObj({ ...obj });
        } else {
            var opts = {
                type: 'warning',
                title: 'Warning',
                message: message,
                position: 'top',
                close_time: 5000
            }
            dispatch(openToast({ toast_open: (!open), toast_opts: opts }))
        }

    }

    const onClickButtonBack = () => {
        dispatch(resetTMSCTGR());
        setTaskGroupObj({ ...obj });
    }

    const onChangeIsActive = (e) => {
        var v = (e.target.checked ? 1 : 0);
        dispatch(setTMSCTGRDataEntry({ ...dataEntry, is_active: v }));
    }

    // <CheckBoxCustom disabled={taskGroupObj.disabled_next} componentId={"ButtonTMSCTGGroupOnly"} onChange={onChangeIsPublic}
    //                         checked={(dataEntry.is_public === 1)}
    //                         checkBoxTitle={"Who can use the task group"} checkBoxLabel={"Only me and my group"}
    //                         checkBoxToolTip={"This task group will only show to the user and her/his group."} />

    return (
        <Modal id="TMSModalHeader" isOpen={openModal} toggle={toggle} centered={true} className="tms-modal-style" backdrop={"static"}>
            <ModalHeader className={(dataEntry.task_group_id === 0) ? `` : `tms-modal-header-edit`}>{modalTitle}</ModalHeader>
            <ModalBody id="ModalBodyCreateTaskGroup">
                <div id="DivTaskGroup" className={`${taskGroupObj.show_taskgroup} fade-in-animation`}>
                    <FormGroup className="form-group">
                        <ApplicationSelect />
                        <InputGroup className="top-input">
                            <TMSRequiredAddOn text={"Task group name"} />
                            <Input id="InputTaskGroupName"
                                value={dataEntry.task_group_name}
                                placeholder="Enter the task group name here..."
                                onChange={onChangeTaskGroupName}
                                />
                            {
                                (dataEntry.task_group_id > 0) && <InputGroupAddon addonType="append">
                                    <InputGroupText id="InputGroupTextIsActive" className="is-active">
                                        <Input disabled={taskGroupObj.disabled_next} id="CheckboxIsActive" type="checkbox" className="check-box-append"
                                            checked={(dataEntry.is_active === 1)}
                                            onChange={onChangeIsActive} />
                                        <ToolTipCustom componentId={"InputGroupTextIsActive"} message={"Check if this task group will be active otherwise inactive."} />
                                    </InputGroupText>
                                </InputGroupAddon>
                            }
                            {
                            (userInfo.access === 'admin') && <InputGroupAddon addonType="append">
                                <InputGroupText id="InputGroupTextIsSystem" className="inputgrouptext-check-box-append">
                                    <Input disabled={taskGroupObj.disabled_next} id="CheckboxIsSystem" type="checkbox" className="check-box-append"
                                        checked={(dataEntry.is_system === 1)}
                                        onChange={onChangeIsSystem} />
                                    <ToolTipCustom componentId={"InputGroupTextIsSystem"} message={"Check if this task group will be system generated. System generated will only be accessible by IT."} />
                                </InputGroupText>
                            </InputGroupAddon>
                            }
                            
                        </InputGroup>
                        <InputGroup className="top-input">
                            <InputGroupAddon addonType="prepend">Task group description</InputGroupAddon>
                            <Input disabled={taskGroupObj.disabled_next} id="InputTaskGroupDesc" type="textarea"
                                placeholder="Enter the task group description here..."
                                value={dataEntry.task_group_desc}
                                onChange={onChangeTaskGroupDesc} />
                        </InputGroup>
                        <CheckBoxCustom disabled={taskGroupObj.disabled_next} componentId={"ButtonTMSCTGEmail"} onChange={(e) => { onChangeShowDiv(e, 'email') } }
                            checked={taskGroupObj.checked_email}
                            checkBoxTitle={"Add a scheduled email"} checkBoxLabel={"Yes"}
                            checkBoxToolTip={"Create new scheduled email for this task group."} />
                        {
                        (userInfo.access === 'admin') && <CheckBoxCustom disabled={taskGroupObj.disabled_next}
                            componentId={"ButtonTMSCTGCriteria"} 
                            onChange={(e) => { onChangeShowDiv(e, 'criteria') } }
                            checked={taskGroupObj.checked_criteria}
                            checkBoxTitle={"Add a criteria"} checkBoxLabel={"Yes"}
                            checkBoxToolTip={"Create new criteria for this task group."} />
                        }
                    </FormGroup>
                    <div id="DivTaskGroupList" className="taskgroup-list-container">
                        <InputGroupAddon addonType="prepend" className="max-w" >Task group listed under the application</InputGroupAddon>
                        <div className="taskgroup-list">
                            <ListTaskGroup list={taskGroupObj.taskgroup_list} />
                        </div>
                    </div>

                </div>
                <TMSScheduleEmail className={`${taskGroupObj.show_email} fade-in-animation`} />
                <TMSCreateCriteria className={`${taskGroupObj.show_criteria} fade-in-animation`} />

            </ModalBody>
            <ModalFooter id="TMSModalFooter">
                <div className={(!taskGroupObj.disabled_next) ? "taskgroup-footer" : "hide-component"} >
                    <ButtonGroup id="ButtonGroupTaskGroupSelections" className={(taskGroupObj.button_group.length > 1) ? "" : "hide-component"}>
                        <Button id="ButtonTaskGroup" disabled={taskGroupObj.disabled_next} color="secondary" onClick={(e) => { onClickShowDiv(e, 'taskgroup') } }
                            className={(taskGroupObj.button_selected === 'taskgroup') ? 'btn-selected' : 'btn-not-selected'} >
                            <img id={`IconTaskGroup`} src={IconTaskList} className="button-icon" alt="" />
                            Task Group
                        <ToolTipCustom componentId={"ButtonTaskGroup"} message={"Task Group"} placement={"top"} />
                        </Button>

                        {
                            (taskGroupObj.button_group.indexOf("email")) > -1 &&
                            <Button id="ButtonEmail" disabled={taskGroupObj.disabled_next} color="secondary" onClick={(e) => { onClickShowDiv(e, 'email') } }
                                className={(taskGroupObj.button_selected === 'email') ? 'btn-selected' : 'btn-not-selected'} >
                                <img id={`IconSchedule`} src={IconSchedule} className="button-icon" alt="" />
                                Scheduled Email
                                <ToolTipCustom componentId={"ButtonEmail"} message={"Scheduled Email"} 
                                    placement={"top"} />
                            </Button>

                        }
                        {
                            (userInfo.access === 'admin' && taskGroupObj.button_group.indexOf("criteria") > -1) &&
                            <Button id="ButtonCriteria" disabled={taskGroupObj.disabled_next} color="secondary" onClick={(e) => { onClickShowDiv(e, 'criteria') } }
                                className={(taskGroupObj.button_selected === 'criteria') ? 'btn-selected' : 'btn-not-selected'} >
                                <img id={`IconCriteria`} src={IconCriteria} className="button-icon" alt="" />
                                Criteria
                                <ToolTipCustom componentId={"ButtonCriteria"} message={"Criteria"} placement={"top"} />
                            </Button>
                        }
                    </ButtonGroup>
                </div>
                {
                    (dataEntry.task_group_id > 0) && <Button color="secondary" className="main-buttons"
                        onClick={onClickButtonBack}>
                        <img id={`IconBack`} src={IconBack} className="button-icon" alt=""/>  Back
                    </Button>
                }
                {
                    (dataEntry.task_group_id > 0) && <Button color="success" className="main-buttons"
                        disabled={taskGroupObj.disabled_next}
                        onClick={onButtonClickCreateOrModify}>
                        <img id={`IconProceedEdit`} src={IconProceedEdit} className="button-icon" alt="" />  Modify
                    </Button>
                }
                {
                    (dataEntry.task_group_id === 0) && <Button color="primary" disabled={taskGroupObj.disabled_next} size="sm" className="main-buttons"
                        onClick={onButtonClickCreateOrModify}>
                        <img src={IconNew} className="button-icon" alt="" /> Create
            </Button>
                }
                {' '}
                <Button color="danger" size="sm" className="main-buttons" onClick={toggle}>
                    <FontAwesomeIcon icon={faDoorOpen} className="main-button-icon" />Cancel
            </Button>
            </ModalFooter>
        </Modal>
    );
}

export default TMSCreateTaskGroup;

