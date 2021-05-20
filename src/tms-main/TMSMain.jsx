import React, { useEffect, useRef } from 'react'; 
import './resources/css/tms-ui.css';
import { CubeSpinner } from 'ti-react-components';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'reactstrap'; 

import PlanningMenu from "../planning/components/PlanningMenu";
import TMSTasksDataTable from './components/TMSTasksDataTable.jsx';
import TMSActionDataTable from './components/TMSActionDataTable.jsx';
import TMSCreateTasks from './components/TMSCreateTasks.jsx';
import TMSAddAction from './components/TMSAddAction.jsx';
import TMSAddTask from './components/TMSAddTask.jsx'; 
import TMSCreateStatus from './components/TMSCreateStatus.jsx'  
import TMSCreateApplication from './components/TMSCreateApplication.jsx'
import TMSCreateTaskGroup from './components/TMSCreateTaskGroup.jsx'
import IconApp from './resources/images/web-application.svg'; 
import IconTaskGroup from './resources/images/taskgroup-list.svg';
import IconTasks from './resources/images/tasks.svg';
import IconAddTask from './resources/images/add-task.svg';
import IconHome from './resources/images/home.svg';
import IconAction from './resources/images/action.svg';
import IconStatus from './resources/images/status.svg';
import {   
    setTMSMRObj, 
    setTMSATRAppInfo, 
    getTMSCARAppList,
    getTMSCTTaskGroup,
    getTMSESRUmsEmail, 
    setTMSCTGRModal,
    setTMSCARModal,
    loggedInUser,
    setTMSMRStatusDefs,
    setTMSMRGroupName,
    setTMSAARShowCreateStatus,
    setTMSMRCriteriaTableColumns 
} from './actions/TMSActions'; 
import Toast from './components/Toast.jsx';  

const TMSMain = () => {
    var obj = {
        show_task_table: true,
        show_action_table: false,
        show_add_action: false,
        show_create_task: false, 
        show_add_task: false,
        show_button_add_task: true,
        show_button_create_task: true,
        show_button_home: false,
        show_button_action_table: false 
    }
    const tmsMainObj = useSelector(state => state.TmsReducer.TMSMR.obj);  
    const loading = useSelector(state => state.TmsReducer.TMSMR.open_loading)
    var open = useSelector(state => state.TmsReducer.TMSMR.toast_open);
    var toastOpts = useSelector(state => state.TmsReducer.TMSMR.toast_opts);
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info); 
    var actionData = {...useSelector(state => state.TmsReducer.TMSAAR.action_data)}; 
    var toggleCreateStatus = useSelector(state => state.TmsReducer.TMSAAR.show_create_status); 
    const dispatch = useDispatch();
    const firsLoad = useRef(true);
    useEffect( () => {  
        // for task table
        var d = document.querySelector('.tmstasktable-div');
        // remove the upper pagination of the reactive table
        if(d) {
            d.querySelector('.float-right').style.display = "none";
            d.querySelector('.btn.btn-sm.btn-outline-primary').style.display = "none";
            
            // remove the bottom setting buttons
            var d1 = d.querySelectorAll('.navBar')[1];
            if(d1) {
                d1.querySelector('.mr-1.mb-1').style.display = "none";
            }
        }
        

        if(tmsMainObj.show_action_table){
            // for task table
            d = document.querySelector('.tmsactiontable-div');
            d.querySelector('.btn.btn-sm.btn-outline-primary').style.display = "none";
            if(d){
                // remove the upper pagination of the reactive table
                d.querySelector('.float-right').style.display = "none";
                // remove the bottom setting buttons
                d1 = d.querySelectorAll('.navBar')[1];
                if(d1){
                    d1.querySelector('.mr-1.mb-1').style.display = "none"; 
                }
            }
            
        }

        if(firsLoad){ 
            if(userInfo.id !== ''){
                dispatch(getTMSCARAppList()); 
                dispatch(getTMSCTTaskGroup());
                dispatch(getTMSESRUmsEmail());
                dispatch(setTMSMRStatusDefs());
                dispatch(setTMSMRGroupName());
                dispatch(setTMSMRCriteriaTableColumns());
                firsLoad.current = false;
            } else {
                dispatch(loggedInUser());
            }            
        }  
        // eslint-disable-next-line
    }, [userInfo.id]);

    const onButtonClickMainMenu = (value) => {  
        dispatch(setTMSMRObj({obj:obj,value:value}));
        if(value === "add_task"){
            dispatch(setTMSATRAppInfo());  
        }
    } 

    const onClickButtonOpenModal = () => { 
        dispatch(setTMSCTGRModal(true)); 
    }
    
    return (
        <div className="main">
            <PlanningMenu/>
            <TMSCreateApplication/>
            <TMSCreateTaskGroup/>   
            <TMSCreateTasks/>
            <TMSAddTask/>
            <TMSAddAction/>
            {
            (loading.open) && <div className="loading-screen-on">
                <div className="loading-mask">
                    <CubeSpinner show={true} />
                    <div className="loading-text">{loading.text}</div>
                </div>                                  
            </div>
            }
            <Toast toggle={open} opts={toastOpts}/>
            <TMSCreateStatus toggle={toggleCreateStatus}/> 
            <div id="DivTMSMain" className="tmsmain-div">            
                <div className="tmsmain-buttons" id="DivTMSMainButtons">    
                    <Button color="primary" size="sm" 
                        className={(tmsMainObj.show_button_home) ? "menu-buttons":"hide-component"}
                        onClick={() => {onButtonClickMainMenu("home")}}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconHome`} src={IconHome} className="button-icon-main"/>
                            <div className="menu-buttons-text">Take Me Home</div>
                        </div> 
                    </Button>
                    
                    {
                    (userInfo.access === 'admin') && <Button color="primary" size="sm" 
                        className={(tmsMainObj.show_button_create_task) ? "menu-buttons":"hide-component"}
                        onClick={() => {dispatch(setTMSCARModal(true))}}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconApp`} src={IconApp} className="button-icon-main"/>
                            <div className="menu-buttons-text">Create New Application</div>
                        </div>                        
                    </Button>
                    }
                    {' '}
                    {
                    (userInfo.access === 'admin') && <Button color="primary" size="sm" 
                        className={(tmsMainObj.show_button_create_task) ? "menu-buttons":"hide-component"}
                        onClick={() => {dispatch(setTMSAARShowCreateStatus(!toggleCreateStatus))}}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconStatus`} src={IconStatus} className="button-icon-main"/>
                            <div className="menu-buttons-text">Create New Status</div>
                        </div>                        
                    </Button>
                    }
                    {' '}
                    {
                    (userInfo.access === 'admin' || userInfo.access === 'user_admin') && <Button color="primary" size="sm" 
                        className={(tmsMainObj.show_button_create_task) ? "menu-buttons":"hide-component"}
                        onClick={onClickButtonOpenModal}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconTaskGroup`} src={IconTaskGroup} className="button-icon-main"/>
                            <div className="menu-buttons-text">Create New Task Group</div>
                        </div>                        
                    </Button>
                    }                    
                    {' '}
                    {
                    (userInfo.access === 'admin' || userInfo.access === 'user_admin') && <Button 
                    id="ButtonCreateTasks" color="primary" size="sm" 
                        className={(tmsMainObj.show_button_create_task) ? "menu-buttons":"hide-component"}
                        onClick={() => {onButtonClickMainMenu("create_task")}}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconTasks`} src={IconTasks} className="button-icon-main"/>
                            <div className="menu-buttons-text">Create New Tasks From A Task Group</div>
                        </div>
                    </Button>
                    }                    
                    {' '}
                    <Button color="success" size="sm" id="ButtonAddExistingTasks"
                        className={(tmsMainObj.show_button_add_task) ? "menu-buttons":"hide-component"}
                        onClick={() => {onButtonClickMainMenu("add_task")}}>
                        <div className="menu-div-buttons">                        
                            <img alt=""  id={`IconAddTask`} src={IconAddTask} className="button-icon-main"/>
                            <div className="menu-buttons-text">Add Existing Tasks To My List</div>
                        </div>                       
                    </Button> 
                    <Button color="success" size="sm" 
                        onClick={() => {onButtonClickMainMenu("add_action")}}
                        className={(tmsMainObj.show_button_action_table) ? "menu-buttons":"hide-component"}>
                        <div className="menu-div-buttons">
                            <img alt=""  id={`IconAction`} src={IconAction} className="button-icon-main"/>
                            <div className="menu-buttons-text">Add New Action</div>
                        </div>                         
                    </Button> 
                </div>        
                <div className="tmsmain-datatables" id="DivTMSMainDataTables">   
                    <div className={(tmsMainObj.show_task_table) ? "tmstasktable-div":"hide-component"} id="DivTMSTasks">
                        <h4 className="tms-title">My Tasks</h4><TMSTasksDataTable />
                    </div> 
                    <div className={(tmsMainObj.show_action_table) ? "tmsactiontable-div":"hide-component"} id="DivTMSActions">
                        <h4 className="tms-title">Actions for Task Name: {actionData.task_name} Subject: {actionData.task_subject}</h4><TMSActionDataTable />
                    </div>
                </div>
            </div> 
        </div>
        
        
    ); 
    
}

export default TMSMain;

