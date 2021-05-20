import { axiosInstance } from "../../ti-axios/ti-axios";

import { 
    TMSESR_SET_OPEN_EMAIL_SEARCH,
    TMSESR_GET_LDAP_RESULT,
    TMSESR_SET_SEARCH_VALUE,
    TMSESR_SET_DISABLE_SEARCH_BUTTON,
    TMSESR_ADD_UMS_EMAIL,
    TMSESR_SET_SELECTED_VALUE,
    TMSESR_SET_MODAL_VALUES,
    TMSESR_SET_MULTI_VALUE,
    TMSESR_RESET, 
    TMSESR_GET_UMS_EMAIL,
    TMSCAR_SET_MODAL_STATUS,
    TMSCAR_SET_INVALID_APP_INPUT,
    TMSCAR_SET_DISABLE_CREATE,
    TMSCAR_GET_APPLICATION_LIST,
    TMSCAR_SET_APPLICATION_OBJ,
    TMSCAR_SET_APP_CUR_LIST,
    TMSCAR_SET_GROUP_NAME_CUR_LIST,
    TMSCT_SET_APPLICATION_NAME,
    TMSCT_SET_TASK_LIST,
    TMSCT_SET_DISABLE_TASK_GROUP,
    TMSCT_SET_TASK_GROUP,
    TMSCT_SET_DISABLE_TASK_NAME,
    TMSCT_SET_TASK_NAME,
    TMSCT_SET_DISABLE_TASK_DESC,
    TMSCT_SET_TASK_DESC,
    TMSCT_SET_DISABLE_ADD_BUTTON,
    TMSCT_SET_DISABLE_IS_MANDATORY,
    TMSCT_SET_TASKGROUP_LIST,
    TMSCT_SET_TASK_LIST_DELETED,
    TMSESR_ADD_UMS_EMAIL_OPTIONS,
    TMSSER_SET_WEEKLY_OPTION,
    TMSSER_SET_MONTHLY_OPTION,
    TMSSER_SET_QUARTER_OPTION,
    TMSSER_SET_SELECTED_SCHEDULE,
    TMSSER_RESET,
    TMSCCR_GET_TABLE_COLUMN,
    TMSCCR_GET_TABLE,
    TMSCCR_GET_COLUMN,
    TMSCCR_SET_CRITERIA,
    TMSCCR_SET_SELECT_TABLE,
    TMSCCR_SET_RUN_TIME,
    TMSCCR_RESET,
    TMSCTGR_SET_MODAL_STATUS,
    TMSCTGR_SET_TASKGROUP_NAME,
    TMSCTGR_GET_TASKGROUP_INFO,
    TMSCTGR_SET_TASKGROUP_ID,
    TMSCTGR_SET_DATA_ENTRY,
    TMSCTGR_RESET,
    TMSTDTR_SET_SELECTED_ROW,
    TMSTDTR_SET_EDIT_DATE,
    TMSTDTR_GET_TASK_INFO,  
    TMSTDTR_SELECTED_TASK_ROW,
    TMSTDTR_SET_TASK_INFO,
    TMSTDTR_SET_PREVIOUS_ID,
    TMSTDTR_SET_MERGE_DATA,
    TMSTDTR_SET_STATUS_SELECTION,
    TMSMR_OPEN_TOAST,
    TMSMR_SET_OBJECT,
    TMSMR_OPEN_LOADING, 
    TMSMR_RETURN_HOME,
    TMSMR_USER_INFO,
    TMSMR_GET_STATUS_DEFS,
    TMSMR_GET_GROUP_NAME,
    TMSMR_GET_CRITERIA_TABLES_COLUMNS,
    TMSADTR_GET_ACTION_INFO,
    TMSADTR_FILTER_ACTION_INFO,
    TMSADTR_SET_DIALOG_DELETE,
    TMSADTR_SET_SHOW_FILE_LIST,
    TMSAAR_SET_UPLOAD_ARRAY,
    TMSAAR_SET_STATUS_SELECTION,
    TMSAAR_SET_ACTION_DATA,
    TMSAAR_SET_STATUS_DATA,
    TMSAAR_SET_SHOW_CREATE_STATUS,
    TMSATR_SET_TASK_INFO,
    TMSATR_SET_APPLICATION_INFO,
    TMSATR_SET_TASK_GROUP_INFO,
    TMSATR_SET_TASKS,

    TMSPPIAAR_SET_SHOW_MODAL, // TMS PPI
    TMSPPIAAR_SET_SHORTAGE_INFO
} from "../constants/TMSConstants";

import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import { getErrorResponseFromLogin, hideCubeSpinner } from "../../main/actions/mainComponentActions";

const cookies = new Cookies();

// for testing purposes
// import taskInfo from "../resources/files/task_info.json";
// import actionInfo from "../resources/files/action_info.json";
// import addTaskInfo from "../resources/files/add_task.json";

const setTaskGroupEmails = (store,data,dispatch,getState) => {
    var obj = {}

    data.forEach((item) => { 
        var iObj = {};
        Object.keys(item).forEach((key) => {
            if(key !== 'ID_LINK' 
                && key !== 'TABLE_NAME_LINK' 
                && key !== 'TYPE'){
                iObj[key] = item[key]
            }
        })
        if(item.TYPE === 'FROM'){
            obj[item.TYPE.toLowerCase()] = {
                label: item.USER_ID + " - " + item.USER_FULL_NAME + " - " + item.USER_EMAIL,
                value: iObj
            } 
        } else {
            var arr = [];
            if(Array.isArray(obj[item.TYPE.toLowerCase()])){
                arr = [...obj[item.TYPE.toLowerCase()]];
            }
            arr.push({ label: item.USER_EMAIL ,value: iObj});  
            obj[item.TYPE.toLowerCase()] = arr;
        } 
    })

    store.value = obj;

    dispatch({
        type: TMSESR_SET_SELECTED_VALUE,
        payload: store
    })
}

const getTaskGroupList = (app,dispatch,getState) => { 
    let list = [...getState().TmsReducer.TMSCTGR.taskgroup_info]
        .filter(v => v.APPLICATION_ID === app.app_id)
        .map(v => { return({task_group: v.TASK_GROUP_NAME, task_group_desc: v.TASK_GROUP_DESCRIPTION, task_group_id: v.TASK_GROUP_ID, system_generated: v.SYSTEM_GENERATED})});    
    let distinct = list.filter((v,i,a)=>a.findIndex(t=>(t.task_group === v.task_group))===i) 
    dispatch({
        type: TMSCT_SET_TASKGROUP_LIST,
        payload: distinct
    })
}

const getTaskGroupInfo = (dispatch,getState,app) => { 
    dispatch(setLoader({open: true, text: 'Loading task group information...'}));
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info; 
    axiosInstance.post(`/tms/tmsweb/getTaskGroups`,{ user_id: userInfo.id.toUpperCase()})
    .then(res => { 
        var results = res.data;  
        dispatch({
            type: TMSCTGR_GET_TASKGROUP_INFO,
            payload: results
        }); 
        dispatch(setLoader());

        if(typeof app.app_id !== 'undefined'){
            getTaskGroupList(app,dispatch,getState);
        }
        

    }).catch(err => {
        popErrorMessage(err,dispatch,getState);
    }) 
}

const popErrorMessage = (err,dispatch,getState) => {
    if(err.response){         
        var d = err.response.data;
        var title = (d.status === 500) ? 'Server Error' : 'Error';
        var opts = {
            type: 'error',
            title: title,
            message: d.message,
            position: 'top',
            close_time: 5000
        }

        var toastOpen = getState().TmsReducer.TMSMR.toast_open;

        dispatch({
            type: TMSMR_OPEN_TOAST,
            payload: {toast_open: !toastOpen,toast_opts:opts}
        })

    }
    dispatch(setLoader());
}

const popSuccessMessage = (res,dispatch,getState) => {
        var type = 'success';
        var title = 'Success';
        var message = res.data;
        var toastOpen = getState().TmsReducer.TMSMR.toast_open;
        if(res.status === 200){
            type = (message.includes("Error")) ? 'error' : type;
            title = (message.includes("Error")) ? 'Error' : title;
        } else {
            type = 'error';
            message = 'Process encountered an issue!';
        }

        var opts = {
            type: type,
            title: title,
            message: message,
            position: 'top',
            close_time: 3000
        }

        dispatch({
            type: TMSMR_OPEN_TOAST,
            payload: {toast_open: !toastOpen,toast_opts:opts}
        })
        
        dispatch(setLoader());
}

export const setLoader = (obj) => (dispatch,getState) => {
    var o = (typeof obj !== 'undefined') ? obj.open : false;
    var t = (typeof obj !== 'undefined') ? obj.text : '';
    dispatch({
        type: TMSMR_OPEN_LOADING,
        payload: {open: o, text: t}
    })
}

export const loggedInUser = () => (dispatch,getState) => {
    dispatch(setLoader({open: true, text: 'Logging in user information...'}));
    //http://lelvtc0312:8990/uasms_test/user/getLoggedInUser
    axiosInstance.get(`uasms/user/getLoggedInUser`)
    .then(r => {    
        var res = r.data;  
        const token = jwt_decode(cookies.get("oidc-id-token"));
        // validate user access using jwt token
        if (res.id.toUpperCase() !== token.uid.toUpperCase()) {
            dispatch(hideCubeSpinner());
            dispatch(getErrorResponseFromLogin(403));
        } 
        else {
            res.group_names = [...res.groupRoles].map(v => { return v.groupName });

            // axiosInstance.post(`/tms/tmsweb/getStatusAccess`,{user_id: res.id})
            axiosInstance.get(`/tms/tmsweb/getStatusAccess`)
            .then(r2 => {  
                res.access = r2.data;            
                dispatch({
                    type: TMSMR_USER_INFO,
                    payload: res
                })
     
                var opts = {
                    type: 'success',
                    title: 'Login Successful',
                    message: `Hi ${res.name}! Welcome to Task Management System`,
                    position: 'top',
                    close_time: 3000
                }
                var toastOpen = getState().TmsReducer.TMSMR.toast_open;
                dispatch({
                    type: TMSMR_OPEN_TOAST,
                    payload: {toast_open: !toastOpen,toast_opts:opts}
                })
                dispatch(setLoader());
            })
            .catch(err => {
                popErrorMessage(err,dispatch,getState);
            })
        }
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

// TMSAddTask
export const mergeTMSATRTaskInstance = (data) => (dispatch,getState) => { 
    dispatch(setLoader({open: true, text: 'Creating or updating task instances. Please wait...'}));
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info;
    
    if(data.task_instance[0].instance_id === 0){
        // data for email for scheduled auto email
        var emailStore = {...getState().TmsReducer.TMSESR.add_task_email_store};
        var objEmail = {};
        Object.keys(emailStore).forEach((key) => {
            if(emailStore[key] !== null){ 
                var newVal;            
                // make keys to lowercase
                if(Array.isArray(emailStore[key])){
                    newVal = [];                
                    emailStore[key].map(v => v.value).forEach((i) => { 
                        var newObj = {};
                        // console.log(i);
                        Object.keys(i).forEach((j) => {
                            newObj[j.toLowerCase()] = i[j];
                        })
                        newVal.push(newObj);
                    }) 
                } else {
                    newVal = {};
                    var i = emailStore[key].value;
                    Object.keys(i).forEach((j) => {
                        newVal[j.toLowerCase()] = i[j];
                    })
                } 
                objEmail[key] = newVal;
            }
        }) 
        objEmail['from'] = {
            user_full_name: userInfo.name,
            user_email: userInfo.email,
            user_id: userInfo.id,
            group_name: userInfo.group
        }
        data.task_instance_email = objEmail; 
    }

    data.user_id = userInfo.id;
    data.local_datetime = new Date().toString(); 
    axiosInstance.post(`/tms/tmsweb/mergeTaskInstance`,data)
    .then(r => {  
        // var res = r.data;     
        dispatch(setLoader());
        dispatch(getTMSTDTRTaskInfo());
        dispatch({
            type: TMSSER_RESET 
        })
        var reset = {...getState().TmsReducer.TMSESR,
            add_task_email_store: {} }
        dispatch({
            type: TMSESR_RESET,
            payload: reset
        })

        var homeObj = getState().TmsReducer.TMSMR.obj;

        dispatch(setTMSMRObj({obj:homeObj,value:'close_task'}));
        popSuccessMessage(r,dispatch,getState);
    }) 
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

export const setTMSATRTasks = (tasks) => (dispatch,getState) => {
    dispatch({
        type: TMSATR_SET_TASKS,
        payload: tasks
    })
}
export const setTMSATRTaskGroupInfo = (app_id) => (dispatch,getState) => { 
    dispatch(setLoader({open: true, text:'Retrieving task group info...'}));
    axiosInstance.post(`/tms/tmsweb/getTaskGroupByAppId`,{app_id: app_id})
    .then(r => {  
        var res = r.data;   
        var list = res.map(v => {return({task_group_name: v.TASK_GROUP_NAME, task_group_id: v.TASK_GROUP_ID})})
        var distinct = list.filter((v,i,a)=>a.findIndex(t=>(t.task_group_name === v.task_group_name))===i) 
        var taskGroup = distinct.map( v => {return({label:v.task_group_name, value: v})})
        dispatch({
            type: TMSATR_SET_TASK_GROUP_INFO,
            payload: taskGroup
        })

        dispatch({
            type: TMSATR_SET_TASK_INFO,
            payload: res
        })

        dispatch(setLoader());
    }) 
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

export const setTMSATRAppInfo = () => (dispatch,getState) => {  
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info; 
    let application = [...getState().TmsReducer.TMSCAR.application_list]
        .filter(v => {
            if(v.GROUP_NAME !== null && userInfo.access === 'user'){
                return v.IS_ACTIVE === "1" && v.GROUP_NAME.split(';').some(r => userInfo.group_names.indexOf(r) > -1);
            } else {
                return v.IS_ACTIVE === "1";
            }
        })
        .map(v => ({ value: { app_name: v.APPLICATION_NAME, app_id: v.ID }, label: v.APPLICATION_NAME }));

    dispatch({
        type: TMSATR_SET_APPLICATION_INFO,
        payload: application
    })
 
}

// TMSAddAction
export const setTMSAARShowCreateStatus = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSAAR_SET_SHOW_CREATE_STATUS,
        payload: d
    })
}

export const mergeTMSAARMergeAction = (files,action_id) => (dispatch,getState) => {
    dispatch(setLoader({open: true, text: 'Merging action to the specific task instance. Please wait...'}));
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info;
    var o = {...getState().TmsReducer.TMSAAR.action_data};  
    o.action_id = action_id;
    o.user_id = userInfo.id;  
    o.local_date_time = new Date().toString(); 
    var emailStore = {...getState().TmsReducer.TMSESR.action_email_store};
    if(typeof emailStore !== 'undefined'){
        if(typeof emailStore.to !== 'undefined' && emailStore.to !== null) { 
            if(emailStore.to.length > 0){
                var objEmail = {};
                Object.keys(emailStore).forEach((key) => {
                    if(emailStore[key] !== null){ 
                        var newVal;            
                        // make keys to lowercase
                        if(Array.isArray(emailStore[key])){
                            newVal = [];                
                            emailStore[key].map(v => v.value).forEach((i) => { 
                                var newObj = {};
                                // console.log(i);
                                Object.keys(i).forEach((j) => {
                                    newObj[j.toLowerCase()] = i[j];
                                })
                                newVal.push(newObj);
                            }) 
                        } else {
                            newVal = {};
                            var i = emailStore[key].value;
                            Object.keys(i).forEach((j) => {
                                newVal[j.toLowerCase()] = i[j];
                            })
                        } 
                        objEmail[key] = newVal;
                    }
                }) 
                objEmail['from'] = {
                    user_full_name: userInfo.name,
                    user_email: userInfo.email,
                    user_id: userInfo.id,
                    group_name: userInfo.group
                }
                o.action_email = objEmail;  
            }
        }
    }

    const formData = new FormData(); 
    var blob = new Blob([JSON.stringify(o)], { type: "application/json" })
    formData.append('params',blob); 
    files.forEach((file) => {
        formData.append('files',file)
    })  

    axiosInstance.post(`/tms/tmsweb/mergeAction`, formData )
    .then(r => {    
        dispatch(getTMSTDTRTaskInfo());
        dispatch(getTMSTDTRActionInfo({
            task_subject: o.task_subject,
            task_name: o.task_name,
            task_instance_id: o.task_instance_id
        }));
        dispatch(setTMSAARUploadArray([]));  
        dispatch(setTMSAARUploadArray([1]));  
        dispatch(setTMSAARSetActionData({  
            action_id: 0,
            merge_type: '', 
            action_status: '',
            action_name: '', 
            action_comment: '',
            action_refresh: !o.action_refresh
        }));
        if(typeof emailStore !== 'undefined'){
             var reset = {...getState().TmsReducer.TMSESR,
                action_email_store: {} }; 
            dispatch({
                type: TMSESR_RESET,
                payload: reset
            })
        }
        var homeObj = getState().TmsReducer.TMSMR.obj;
        dispatch(setTMSMRObj({obj:homeObj,value:'close_action'})); 
        popSuccessMessage(r,dispatch,getState);        
        dispatch(setLoader());
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

export const mergeTMSAARMergeStatus = () => (dispatch,getState) => {
    dispatch(setLoader({open:true,text:'Creating new or updating existing status. Please wait...'}));
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info;
    var o = {...getState().TmsReducer.TMSAAR.status_data};
    o.status_type = o.status_type.label;
    o.status_id = o.id;
    o.status_name = o.status;
    o.user_id = userInfo.id;
    delete o.status;
    delete o.cur_status_info;        
    axiosInstance.post(`/tms/tmsweb/mergeStatusDef`, o)
    .then(r => {  
        dispatch(setTMSMRStatusDefs());
        dispatch(setTMSAARSetStatusData({
            id: 0,
            status: '',
            status_desc: '',
            status_type: '',
            old_status: ''
        }))
        popSuccessMessage(r,dispatch,getState);        
        dispatch(setLoader());
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

export const setTMSAARSetStatusData = (data) => (dispatch,getState) => {
    var o = {...getState().TmsReducer.TMSAAR.status_data}; 
    // iterate objects from source
    Object.keys(data).forEach((item) => {
        o = {...o,[item]:data[item]}
    }) 
    dispatch({
        type: TMSAAR_SET_STATUS_DATA,
        payload: o
    })
}

export const setTMSAARSetActionData = (data) => (dispatch,getState) => {
    var o = {...getState().TmsReducer.TMSAAR.action_data}; 
    // iterate objects from source
    Object.keys(data).forEach((item) => {
        o = {...o,[item]:data[item]}
    }) 
    dispatch({
        type: TMSAAR_SET_ACTION_DATA,
        payload: o
    })
}

export const setTMSAARUploadArray = (data) => (dispatch,getState) => {
    dispatch({
        type: TMSAAR_SET_UPLOAD_ARRAY,
        payload: data
    })
} 

// TMSMain
export const setTMSMRCriteriaTableColumns = () => (dispatch,getState) => {
    dispatch(setLoader(true,'Retrieving criteria tables and columns...'));
    axiosInstance.get(`/tms/tmsweb/getCriteriaTableColumns`)
    .then(res => { 
        var results = res.data;  
        dispatch({
            type: TMSMR_GET_CRITERIA_TABLES_COLUMNS,
            payload: results
        })
        dispatch(setLoader());
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

export const setTMSMRGroupName = () => (dispatch,getState) => {
    dispatch(setLoader(true,'Retrieving group names...'));
    dispatch({
        type: TMSMR_GET_GROUP_NAME,
        payload: []
    })

    axiosInstance.get(`/tms/tmsweb/getGroupName`)
    .then(r => {  
        var res = r.data;  
        dispatch({
            type: TMSMR_GET_GROUP_NAME,
            payload: res
        })
        
        // group name selection for create application
        var arr = res.map( v => { return({ label: v.GROUP_NAME, value: v.GROUP_NAME }) })
        dispatch({
            type: TMSCAR_SET_GROUP_NAME_CUR_LIST,
            payload: arr
        })
        
        dispatch(setLoader());
    }) 
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}
export const setTMSMRStatusDefs = () => (dispatch,getState) => {
    dispatch(setLoader(true,'Retreiving status definitions...'));
    dispatch({
        type: TMSMR_GET_STATUS_DEFS,
        payload: []
    })
    axiosInstance.get(`/tms/tmsweb/getStatus`)
    .then(r => {  
        var res = r.data;  
        dispatch({
            type: TMSMR_GET_STATUS_DEFS,
            payload: res
        })

        // set the status for task instance only
        var taskStatus = [...new Set(res.filter(v => v.IS_ACTIVE === "1" && v.TYPE === 'TASK INSTANCE')
            .map(v => { return({label: v.STATUS, value: v.STATUS})}))]
        dispatch({
            type: TMSTDTR_SET_STATUS_SELECTION,
            payload: taskStatus
        })

        var actionStatus = [...new Set(res.filter(v => v.IS_ACTIVE === "1" && v.TYPE === 'ACTION')
            .map(v => { return({label: v.STATUS, value: v.STATUS})}))]
        dispatch({
            type: TMSAAR_SET_STATUS_SELECTION,
            payload: actionStatus
        })

        dispatch(setLoader());
    }) 
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
    
    
}

export const openToast = (data) => (dispatch,getState) => {
    var toastOpen = getState().TmsReducer.TMSMR.toast_open;
    data.toast_open = !toastOpen;
    dispatch({
        type: TMSMR_OPEN_TOAST,
        payload: data
    })
}

export const setTMSMRObj = (data) => (dispatch,getState) => { 
    var d = document.getElementById('DivTMSTasks');
    d.style.width="100%";
    if(data.value === 'home') {
        dispatch({
            type: TMSMR_RETURN_HOME 
        })
    } else {
        var o = {...data.obj};
        var value = data.value; 
        var showValue = "show_"+value;
        if(value !== "home" && value !== "close_action" && value !== "close_task" 
            && value !== "create_task" && value !== "add_task"){  
            var keys = Object.keys(o);
            keys.forEach((item,index) => { 
                if( item === "show_task_table" 
                    || item === showValue) {
                    o[item] = !o[item];
                }
                // hide other buttons other than home 
                if(item.toString().includes("button")){ 
                    o[item] = !o[item]; 
                } 
            })
        } 

        if(value === "create_task" || value === "add_task") {
            o[showValue] = true;
        }
        
        // if(value === "add_task"){
        //     o.show_task_table = true; 
        //     d.style.width="50%";
        // }

        if(value !== "action_table" && value !== "close_action"){
            o.show_button_action_table = false;
        } else { 
            o.show_add_task = false;
            o.show_button_add_task = false;
            o.show_button_create_task = false;
            o.show_button_home = true;
            if(value === "close_action"){
                o.show_button_action_table = true;
                o.show_add_action = false;
            } 
        }

        if(value === "add_action"){
            o.show_action_table = true;
            o.show_add_action =true;
            o.show_add_task = false;
            o.show_button_add_task = false;
            o.show_button_create_task = false;
            o.show_button_home = true; 
        } 
        
        if(value === "close_task"){
            o.show_add_task = false;
            o.show_button_add_task = true;
            o.show_button_create_task = true;
            o.show_button_home = false;
        }

        dispatch({
            type: TMSMR_SET_OBJECT,
            payload: o
        })
    }

    
}

// TMSTasksDataTable
export const setTMSTDTRMergeData = (data) => (dispatch,getState) => {
    var key = Object.keys(data)[0];
    var obj = {...getState().TmsReducer.TMSTDTR.merge_data,[key]:data[key]}; 
    
    // auto set the status if start dttm is already now
    if(key.includes('start')){
        var now = new Date();
        if(now >= new Date(data[key])) {
            obj.selected_status = {label: 'STARTED', value: 'STARTED'}
        } else {
            obj.selected_status = {label: 'WAITING', value: 'WAITING'}
        }
    }

    dispatch({
        type: TMSTDTR_SET_MERGE_DATA,
        payload: obj
    })
}

export const updateTMSDTRSelectValues = (data) => (dispatch,getState) => {
    var selected = [...getState().TmsReducer.TMSTDTR.selected_tasks];
    var index = selected.findIndex(v => v.ROW_ID === data.row_id);
    if(index > -1){ 
        selected[index][data.column] = data.value;
        dispatch({
            type: TMSTDTR_SELECTED_TASK_ROW,
            payload: selected
        })
    }

}

export const selectTMSDTRTask = (row) => (dispatch,getState) => {
    var selected = [...getState().TmsReducer.TMSTDTR.selected_tasks];

    if(!selected.some( v => v.ROW_ID === row.ROW_ID)){
        selected.push(row);
        dispatch({
            type: TMSTDTR_SELECTED_TASK_ROW,
            payload: selected
        })
    }

}

export const unSelectTMSDTRTask = (row) => (dispatch,getState) => {
    var selected = [...getState().TmsReducer.TMSTDTR.selected_tasks]; 
    var index = selected.findIndex(v => v.ROW_ID === row.ROW_ID);
    if(index > -1){
        selected.splice(index,1);
        dispatch({
            type: TMSTDTR_SELECTED_TASK_ROW,
            payload: selected
        })
    }

}

export const updateTMSDTRTask = (rowId) => (dispatch,getState) => {
    var selected = [...getState().TmsReducer.TMSTDTR.selected_tasks]; 
    var task_info = [...getState().TmsReducer.TMSTDTR.task_info]; 
    var index = task_info.findIndex(v => v.ROW_ID === rowId);
    if(index > -1){
        var selectedIndex = selected.findIndex(v => v.ROW_ID === rowId);
        task_info[index] = selected[selectedIndex]; 
        dispatch({
            type: TMSTDTR_SET_TASK_INFO,
            payload: task_info
        })
        dispatch({
            type: TMSTDTR_SELECTED_TASK_ROW,
            payload: []
        })
        dispatch({
            type: TMSTDTR_SET_EDIT_DATE,
            payload: {edit_row:''}
        })
        
    }
} 

export const getTMSTDTRTaskInfo = () => (dispatch,getState) => { 
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info;
    var taskColumns = [...getState().TmsReducer.TMSTDTR.task_columns];
    dispatch({
        type: TMSTDTR_GET_TASK_INFO,
        payload: {
            task_info: [],
            task_columns: taskColumns,
            task_loading: true
        }
    })
    axiosInstance.post(`/tms/tmsweb/getTasks`,{
        user_id: userInfo.id.toUpperCase(),
        user_access: userInfo.access, 
        user_group_names: userInfo.group_names 
    })
    .then(res => { 
        var results = res.data;             
        axiosInstance.post(`/tms/tmsweb/getColumnsByTablesOrView`,{table_view_name: 'VTMS_TASKS'})
        .then(col => {
            var task_columns = []
            task_columns.push({key:'action',label:'Action'});
            task_columns.push({key:'notifications',label:''}); 
            col.data.forEach((item,cellIndex) => { 
                var col_name = item.COLUMN_NAME
                if(
                    col_name !== "TASK_ID"
                    && col_name !== "APPLICATION_ID"
                    && col_name !== "TASK_INST_ID"
                    && col_name !== "ROW_ID"
                    && col_name !== "GROUP_PUBLIC"
                    && col_name !== "GROUP_AUTO_EMAIL"
                    && col_name !== "GROUP_WITH_CRITERIA"
                    && col_name !== "DATA_CNT"
                    && col_name !== "SYSTEM_GENERATED"
                    && col_name !== "INST_DTTM"
                    && col_name !== "TASK_GROUP_ID"
                ){
                    // Remove _ and pascal case item
                    var v = col_name.split("_").join(" "); 
                    v = v.replace(/\w+/g, (w) => {
                        return w[0].toUpperCase() + w.slice(1).toLowerCase();
                    });
                    task_columns.push({key:col_name,label:v});
                }
                
            }) 

            dispatch({
                type: TMSTDTR_GET_TASK_INFO,
                payload: {
                    task_info: results,
                    task_columns: task_columns,
                    task_loading: false
                }
            }) 
        })
        .catch(err => {
            popErrorMessage(err,dispatch,getState);
        })
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
    // for action info 
    axiosInstance.post(`/tms/tmsweb/getColumnsByTablesOrView`,{table_view_name: 'VTMS_ACTIONS'})
    .then(col => {
        var actionColumns = [];
        actionColumns.push({key:'action',label:'Actions'});    
        col.data.forEach((item,cellIndex) => { 
            var col_name = item.COLUMN_NAME
            if(
                col_name !== "TASK_INST_ID"
                && col_name !== "ROW_ID"
                && col_name !== "ACTION_ID" 
            ){
                // Remove _ and pascal case item
                var v = col_name.split("_").join(" "); 
                v = v.replace(/\w+/g, (w) => {
                    return w[0].toUpperCase() + w.slice(1).toLowerCase();
                });
                actionColumns.push({key:col_name,label:v});
            }
            
        })

        dispatch({
            type: TMSADTR_GET_ACTION_INFO,
            payload: {
                action_info:[],
                action_columns:actionColumns
            }
        })
    }) 
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })

}

export const getTMSTDTRActionInfo = (obj) => (dispatch,getState) => {
    var id = obj.task_instance_id;
    dispatch(setTMSAARSetActionData(obj));

    // var prevId = getState().TmsReducer.TMSTDTR.previous_id;
    
    dispatch({
        type: TMSTDTR_SET_PREVIOUS_ID,
        payload: id
    })

    dispatch({
        type: TMSADTR_FILTER_ACTION_INFO,
        payload: []
    })
    axiosInstance.post(`/tms/tmsweb/getActions`,{
        task_inst_id: id
    })
    .then(res => { 
        var results = res.data;  
        dispatch({
            type: TMSADTR_FILTER_ACTION_INFO,
            payload: results
        })
    })
}

export const setTMSTDTRSelectedRow = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSTDTR_SET_SELECTED_ROW,
        payload: d
    })  

}

export const setTMSTDTREditDate = (d) => {
    return {
        type: TMSTDTR_SET_EDIT_DATE,
        payload: d
    }
}


// TMSCreateTaskGroup Actions
export const resetTMSCTGR = () => (dispatch,getState) => {
    dispatch({
        type: TMSCTGR_RESET 
    })
    var reset = {...getState().TmsReducer.TMSCCR,
        criteria:[],
        select_table: '',
        run_time: { label: 'Weekly', value: 'weekly'}}; 
    dispatch({
        type: TMSCCR_RESET,
        payload: reset
    })
    dispatch({
        type: TMSSER_RESET 
    })
    reset = {...getState().TmsReducer.TMSESR,
        schedule_email_store: {},
        criteria_store: {}}; 
    dispatch({
        type: TMSESR_RESET,
        payload: reset
    })
}

export const setTMSCTGRDataEntry = (data) => (dispatch,getState) => {
    dispatch({
        type: TMSCTGR_SET_DATA_ENTRY,
        payload: data
    })
}

export const unEditTMSCTGRTaskGroup = () => (dispatch,getState) => { 
    // reset all values
    dispatch({
        type: TMSCTGR_RESET 
    })
    var reset = {...getState().TmsReducer.TMSCCR,
        criteria:[],
        select_table: '',
        run_time: { label: 'Weekly', value: 'weekly'}}; 
    dispatch({
        type: TMSCCR_RESET,
        payload: reset
    })
    dispatch({
        type: TMSSER_RESET 
    })
    reset = {...getState().TmsReducer.TMSESR,
        schedule_email_store: {},
        criteria_store: {}}; 
    dispatch({
        type: TMSESR_RESET,
        payload: reset
    })
}

export const editTMSCTGRTaskGroup = (id) => (dispatch,getState) => { 
    dispatch(setLoader({open: true, text: 'Loading task group data...'})); 
    dispatch({
        type: TMSCTGR_SET_TASKGROUP_ID,
        payload: id
    })
    axiosInstance.post(`/tms/tmsweb/getTaskGroupSpecific`,{ task_group_id: id})
    .then(res => {   
        // console.log(res.data); 
        var obj = res.data[0];
        var dataEntry =  {...getState().TmsReducer.TMSCTGR.data_entry};

        Object.keys(obj).forEach((item) => {
            dataEntry[item.toLowerCase()] = isNaN(obj[item]) ? obj[item] : parseInt(obj[item]);
        }) 
        dataEntry.old_task_group_name = dataEntry.task_group_name

        dispatch({
            type: TMSCTGR_SET_DATA_ENTRY,
            payload: dataEntry
        })  
 
        dispatch(setLoader({open: true, text: 'Loading scheduled email or criteria data...'})); 
        
        if(dataEntry.is_auto_email === 1){
            axiosInstance.post(`/tms/tmsweb/getTaskEmailSchedule`,{ task_group_id: id})
            .then(res => {   
                // console.log(res.data); 
                var obj = res.data[0]; 
                
                Object.keys(obj).forEach((item) => {
                    dataEntry[item.toLowerCase()] = isNaN(obj[item]) ? obj[item] : parseInt(obj[item]);
                }) 

                dispatch({
                    type: TMSCTGR_SET_DATA_ENTRY,
                    payload: dataEntry
                })    
                var selectedSched = 'weekly';
                var arr;
                if(obj.SPECIFIC_DATE !== null && obj.SPECIFIC_DATE.length > 0) {  
                    selectedSched = 'select date';
                    dataEntry.is_specific_dates = 1;
                    arr = obj.SPECIFIC_DATE.split(';');
                    dispatch({
                        type: TMSSER_SET_MONTHLY_OPTION,
                        payload: arr.map((v) => { return({value:v,label:v}) })
                    })
                } else if (obj.IS_DAILY === "1" || obj.IS_WEEKLY === "1") { 
                    // eslint-disable-next-line
                    arr = new Array('All','Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

                    if(obj.IS_WEEKLY === "1"){ 
                        arr = obj.WEEKLY_DATE.split(';');
                    } 
                    dispatch({  
                        type: TMSSER_SET_WEEKLY_OPTION,
                        payload: arr
                    }) 
                } else if (obj.IS_QUARTERLY === "1") { 
                    selectedSched = 'quarterly';
                    var o = {...getState().TmsReducer.TMSSER.quarterly_option};
                    arr = obj.QUARTER.split(';'); 
                    arr.forEach((item) => {
                        var a = item.split('-');
                        var q = ''; 
                        // console.log(a);
                        if(a[0] === "1") {
                            q = 'first_q'
                        } else if (a[0] === "2") {
                            q = "second_q"
                        } else if (a[0] === "3") {
                            q = "third_q"
                        } else {
                            q = "fourth_q"
                        }
                        o[q] = {
                            before_days: parseInt(a[1]),
                            checked: true,
                            quarter: parseInt(a[0])
                        }
                    }) 
                    
                    dispatch({
                        type: TMSSER_SET_QUARTER_OPTION,
                        payload: o
                    }) 
                }

                dispatch({
                    type: TMSSER_SET_SELECTED_SCHEDULE,
                    payload: selectedSched
                })

                dispatch(setLoader({open: true, text: 'Loading emails...'})); 

                axiosInstance.post(`/tms/tmsweb/getEmails`,{table_name_link: 'TMS_TASK_EMAIL_SCHEDULE', id_link: obj.EMAIL_SCHEDULE_ID})
                .then(r => {    
                    // create schedule_email_store
                    var res = r.data;
                    
                    var store = {
                        key: 'from',
                        store: 'schedule_email_store'
                    }

                    setTaskGroupEmails(store,res,dispatch,getState);

                    dispatch(setLoader()); 
                })
                .catch(err => {
                    popErrorMessage(err,dispatch,getState);
                })

            })
            .catch(err => {
                popErrorMessage(err,dispatch,getState);
            })
        }

        if(dataEntry.with_criteria === 1){
            axiosInstance.post(`/tms/tmsweb/getTaskCriteria`,{table_name_link: 'TMS_TASK_GROUP', id_link: id})
            .then(r => {   
                console.log(r.data); 
                var res = r.data;
                var arr = [];

                dispatch({
                    type: TMSCCR_SET_SELECT_TABLE,
                    payload: {label: res[0].TABLE_NAME, value: res[0].TABLE_NAME}
                }) 

                res.forEach((item) => {
                    var obj = {};
                    Object.keys(item).forEach((key) => {
                        if(key !== 'ID_LINK'
                            && key !== 'RUN_TIME'
                            && key !== 'TABLE_NAME'
                            && key !== 'TABLE_NAME_LINK') {
                            obj[key.toLowerCase()] = item[key]
                        }
                    })
                    arr.push(obj);
                }) 

                dispatch({
                    type: TMSCCR_SET_CRITERIA,
                    payload: arr
                }) 
                dispatch(setLoader({open: true, text: 'Loading emails...'}));  

                var critId = res[0].CRITERIA_ID;

                if(typeof critId !== 'undefined'){
                    axiosInstance.post(`/tms/tmsweb/getEmails`,{table_name_link: 'TMS_TASK_CRITERIA', id_link: critId})
                    .then(r => {    
                        // create schedule_email_store
                        var res = r.data;
                        
                        var store = {
                            key: 'from',
                            store: 'criteria_store'
                        }

                        setTaskGroupEmails(store,res,dispatch,getState);

                        dispatch(setLoader());  
                    })
                    .catch(err => {
                        popErrorMessage(err,dispatch,getState);
                    })
                }
                
            })
            .catch(err => {
                popErrorMessage(err,dispatch,getState);
            })
        }

        if(dataEntry.with_criteria === 0 && dataEntry.is_auto_email === 0) {
            dispatch(setLoader());  
        }

        
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
    
}

export const mergeTMSCTGRTaskGroup = (data) => (dispatch,getState) => {     
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info; 
    dispatch(setLoader({open: true, text: 'Data processing in progress...'}));  
    var tgVal = data.task_group_name;

    if(tgVal.indexOf('[AUTO] ') > -1){
        tgVal = tgVal.replace('[AUTO] ','');
    } 

    data.task_group_name = ((data.is_system === 1) ? '[AUTO] ' : '') + tgVal.trim(); 

    data.user_id = userInfo.id.toUpperCase();
    data.sched_email = {};

    if(data.is_auto_email === 1){
        // data for scheduled auto email
        var tmsserData = {...getState().TmsReducer.TMSSER};
        var selectedSched = tmsserData.selected_schedule; 
        data.is_specific_dates = 0;
        data.is_weekly = 0;
        data.is_daily = 0;
        data.is_quarterly = 0;
        data.quarter = "";
        data.weekly_date = "";
        data.specific_date = "";
        if(selectedSched === 'weekly') { 
            var weeklyOption = [...tmsserData.weekly_option];
            if(weeklyOption.some(v => v === 'All')){
                data.is_daily = 1;    
            } else {
                data.is_weekly = 1;
                data.weekly_date = weeklyOption.join(';');
            }
        } else if (selectedSched === 'select date') {
            var selectedDate = [...tmsserData.monthly_option].map( v => v.value);
            data.specific_date = selectedDate.join(';');
            data.is_specific_dates = 1; 
        } else if (selectedSched === 'quarterly') { 
            data.is_quarterly = 1;
            var arr = [];
            var o = {...tmsserData.quarterly_option};
            Object.keys(o).forEach((key) => {
                if(o[key].checked) {
                    arr.push(o[key].quarter+'-'+o[key].before_days)
                }
            })
            data.quarter = arr.join(';');
            data.weekly_date = "";
        }

        // data for email for scheduled auto email
        var schedEMailStore = {...getState().TmsReducer.TMSESR.schedule_email_store};
        var oSchedEMailStore = {};
        Object.keys(schedEMailStore).forEach((key) => {
            if(schedEMailStore[key] !== null){ 
                var newVal;            
                // make keys to lowercase
                if(Array.isArray(schedEMailStore[key])){
                    newVal = [];                
                    schedEMailStore[key].map(v => v.value).forEach((i) => { 
                        var newObj = {};
                        // console.log(i);
                        Object.keys(i).forEach((j) => {
                            newObj[j.toLowerCase()] = i[j];
                        })
                        newVal.push(newObj);
                    }) 
                } else {
                    newVal = {};
                    var i = schedEMailStore[key].value;
                    Object.keys(i).forEach((j) => {
                        newVal[j.toLowerCase()] = i[j];
                    })
                } 
                oSchedEMailStore[key] = newVal;
            }
        }) 
        data.sched_email = oSchedEMailStore;
    }

    if(data.with_criteria === 1){
        var tmsccrData = {...getState().TmsReducer.TMSCCR};        
        data.criteria = tmsccrData.criteria;
        data.criteria_table = tmsccrData.select_table.value;
        data.criteria_run_time = tmsccrData.run_time.value; 
        // data for email for criteria
        var criteriaEMailStore = {...getState().TmsReducer.TMSESR.criteria_store};
        var oCriteriaEMailStore = {};
        Object.keys(criteriaEMailStore).forEach((key) => {
            if(criteriaEMailStore[key] !== null){ 
                var newVal;            
                // make keys to lowercase
                if(Array.isArray(criteriaEMailStore[key])){
                    newVal = [];                
                    criteriaEMailStore[key].map(v => v.value).forEach((i) => { 
                        var newObj = {};
                        // console.log(i);
                        Object.keys(i).forEach((j) => {
                            newObj[j.toLowerCase()] = i[j];
                        })
                        newVal.push(newObj);
                    }) 
                } else {
                    newVal = {};
                    var i = criteriaEMailStore[key].value;
                    Object.keys(i).forEach((j) => {
                        newVal[j.toLowerCase()] = i[j];
                    })
                } 
                oCriteriaEMailStore[key] = newVal;
            }
        }) 
        data.criteria_email = oCriteriaEMailStore;
    } 
    // console.log(data);
    axiosInstance.post(`/tms/tmsweb/mergeTaskGroup`,data)
    .then(r => {   
        dispatch({
            type: TMSCT_SET_TASKGROUP_LIST,
            payload: []
        })
        // console.log(r);
        var app = {};
        app.app_id = data.app_id;
        popSuccessMessage(r,dispatch,getState);         
        getTaskGroupInfo(dispatch,getState,app); 
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
    
    // reset all values
    dispatch({
        type: TMSCTGR_RESET 
    })
    var reset = {...getState().TmsReducer.TMSCCR,
        criteria:[],
        select_table: '',
        run_time: { label: 'Weekly', value: 'weekly'}}; 
    dispatch({
        type: TMSCCR_RESET,
        payload: reset
    })
    dispatch({
        type: TMSSER_RESET 
    })
    reset = {...getState().TmsReducer.TMSESR,
        schedule_email_store: {},
        criteria_store: {}}; 
    dispatch({
        type: TMSESR_RESET,
        payload: reset
    })
}

export const setTMSCTGRTaskGroupName = (d) => {
    return {
        type: TMSCTGR_SET_TASKGROUP_NAME,
        payload: d
    }
} 

export const setTMSCTGRModal = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSCTGR_SET_MODAL_STATUS,
        payload: d
    }) 

    // load user info from pacer.
} 

// TMSCreateCriteria Actions
export const setTMSCCRRunTime = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSCCR_SET_RUN_TIME,
        payload: d
    }) 
}

export const setTMSCCRSelectTable = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSCCR_SET_SELECT_TABLE,
        payload: d
    }) 
}

export const setTMSCCRCriteria = (list) => (dispatch,getState) => {
    console.log(list);
    dispatch({
        type: TMSCCR_SET_CRITERIA,
        payload: list
    }) 
}

export const getTMSCCRTableColumns = (data) => (dispatch,getState) => {
    
    var criteriaTabCols = [...getState().TmsReducer.TMSMR.criteria_tables_columns];
    var app_id = data.value.app_id; 
    var results = criteriaTabCols.filter(v => v.APPLICATION_ID === app_id)
        .map( v => {
            return ({
                table_name: v.TABLE_NAME,
                column_name: v.COLUMN_NAME,
                type: v.COLUMN_TYPE
            })
        });

    dispatch({
        type: TMSCCR_GET_TABLE_COLUMN,
        payload: results
    }) 

    var table = [...new Set(results.map(item => item.table_name))];
    var arr = [];
    table.forEach((item) => {
        arr.push({label:item, value:item})
    })
    dispatch({
        type: TMSCCR_GET_TABLE,
        payload: arr
    })
    
}

export const getTMSCCRColumns = (table_name) => (dispatch,getState) => { 
    console.log(table_name);
    var tableColumns = [...getState().TmsReducer.TMSCCR.table_column];
    var arr = tableColumns.filter((item)=>{
        return item.table_name === table_name;
    })
    var columns = [];
    arr.forEach((item)=>{
        columns.push({label:item.column_name, value:{column_name:item.column_name, type:item.type}})
    })
    dispatch({
        type: TMSCCR_GET_COLUMN,
        payload: columns
    }) 
}

// TMSScheduledEmail Actions
export const setTMSSERSelectedSchedule = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSSER_SET_SELECTED_SCHEDULE,
        payload: d
    }) 
}

export const setTMSSERMonthlyOptions = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSSER_SET_MONTHLY_OPTION,
        payload: d
    }) 
}

export const setTMSSERWeeklyOptions = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSSER_SET_WEEKLY_OPTION,
        payload: d
    }) 
}

export const setTMSSERQuarterlyOptions = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSSER_SET_QUARTER_OPTION,
        payload: d
    }) 
}

// TMSEmailSearch Actions
export const getTMSESRUmsEmail = () => (dispatch,getState) => {
    
    var list = getState().TmsReducer.TMSESR.ums_email

    if(list.length === 0) {
        dispatch(setLoader({open: true, text: 'Loading user information from PACER...'}));   

        axiosInstance.get(`/tms/tmsweb/getPacerUserInfo`)
        .then(res => {  
            var results = res.data;  
            dispatch({
                type: TMSESR_GET_UMS_EMAIL,
                payload: results
            })
            dispatch(setTMSESUMSOptions());
            dispatch(setLoader());    
        }) 
        .catch(err => {
            popErrorMessage(err,dispatch,getState); 
        })
    }
    
}





export const setTMSESRMultiValue = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSESR_SET_MULTI_VALUE,
        payload: d
    })
}

export const resetTMSESR = () => (dispatch,getState) => { 
    // reset only the values on the modal popup 
    dispatch({
        type: TMSESR_GET_LDAP_RESULT,
        payload: []
    })

    dispatch({
        type: TMSESR_SET_SEARCH_VALUE,
        payload: ''
    });

    dispatch({
        type: TMSESR_SET_DISABLE_SEARCH_BUTTON,
        payload: true
    });

    dispatch({
        type: TMSESR_SET_OPEN_EMAIL_SEARCH,
        payload: false
    });

    dispatch({
        type: TMSESR_SET_MULTI_VALUE,
        payload: []
    });
    
}

export const setTMSESRModalValues = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSESR_SET_MODAL_VALUES,
        payload: d
    })
}

export const setTMSESUMSOptions = () => (dispatch, getState) => {
    var list = [...getState().TmsReducer.TMSESR.ums_email];
    const options = [];
    list.forEach((item) => {
        var fullName = ((item.USER_FULL_NAME.toString().trim().length === 0 ) ? "" : " - " + item.USER_FULL_NAME); 
        var userId = ((item.USER_ID.toString().trim().length === 0 ) ? "" : " - " + item.USER_ID); 
        var label = item.USER_EMAIL + fullName + userId;
        options.push({ value: item, label: label})
    }); 

    dispatch({
        type: TMSESR_ADD_UMS_EMAIL_OPTIONS,
        payload: options
    })
}

export const setTMSESRSearchValue = (d) => (dispatch) => {
    dispatch({
        type: TMSESR_SET_SEARCH_VALUE,
        payload: d
    });

    dispatch({
        type: TMSESR_SET_DISABLE_SEARCH_BUTTON,
        payload: d.length === 0
    });
} 

export const addTMSESRUMSEmail = (d) => (dispatch,getState) => {
    var list = getState().TmsReducer.TMSESR.ums_email; 

    var arr = [];
    var options = [];
    var selectedValue = [];
    var key = getState().TmsReducer.TMSESR.select_key; 
    var store = getState().TmsReducer.TMSESR.selected_store; 
    var storeValues = {...getState().TmsReducer.TMSESR[store]};
    // console.log(storeValues);
    if(!Array.isArray(d)){
        arr.push(d);
    } else {
        arr = d;
    }

    arr.forEach((values,index) => { 
        if(list.filter( v => v.email === values.email).length === 0) {
            list.push(values); 
        }

        var fullName = ((values.USER_FULL_NAME.toString().trim().length === 0 ) ? "" : " - " + values.USER_FULL_NAME); 
        var userId = ((values.USER_ID.toString().trim().length === 0 ) ? "" : " - " + values.USER_ID); 
        var label = values.USER_EMAIL + fullName + userId; 
        selectedValue.push({ value: values, label: label});

        if(arr.length - 1 === index) {
            list.forEach((item) => {
                fullName = ((item.USER_FULL_NAME.toString().trim().length === 0 ) ? "" : " - " + item.USER_FULL_NAME); 
                userId = ((item.USER_ID.toString().trim().length === 0 ) ? "" : " - " + item.USER_ID); 
                label = item.USER_EMAIL + fullName + userId;
                options.push({ value: item, label: label})
            });

            dispatch ({
                type: TMSESR_ADD_UMS_EMAIL,
                payload: list
            });
            console.log(selectedValue)          
            // set selected value add to current selected from store
            var o = {};
            var valStore = []; 
            if((Array.isArray(d))){ 
                if(storeValues[key]){ 
                    valStore = [...storeValues[key]];
                } 
                valStore = valStore.concat(selectedValue); 
                o = {...storeValues,[key]:valStore}
            } else {
                o = {...storeValues,[key]:selectedValue[0]}
            } 

            dispatch({
                type: TMSESR_SET_SELECTED_VALUE,
                payload: {store:store, value:o}
            })  
            // console.log(options)      
            dispatch({
                type: TMSESR_ADD_UMS_EMAIL_OPTIONS,
                payload: options
            })
        }
    })
 
    
}

export const setTMSESRSelectedValue = (d) => (dispatch,getState) => {
    var obj = {...getState().TmsReducer.TMSESR[d.store]}; 
    if(Object.keys(obj).length > 0){
        var val = d.value;
        obj[d.key] = val[d.key];
        d.value = obj;
    } 

    dispatch({
        type: TMSESR_SET_SELECTED_VALUE,
        payload: d
    })
}

export const setTMSESROpenEmailSearch = (d) => {
    return {
        type: TMSESR_SET_OPEN_EMAIL_SEARCH,
        payload: d
    }
}

export const getTMSESRModal = (choice) => (dispatch, getState) => {    
    dispatch(setLoader({open: true, text: 'Searching LDAP...'}));    

    var obj = {}
    var val = getState().TmsReducer.TMSESR.search_value; 
    obj[choice] = val;
    obj.ldap_search_type = choice;

    axiosInstance.post(`/tms/tmsweb/searchLDAPUserInfo`,obj)
    .then((res) => {
        dispatch({
            type: TMSESR_GET_LDAP_RESULT,
        payload: res.data
        })
        dispatch(setLoader());
    })
    .catch((err) => {
        popErrorMessage(err,dispatch,getState);
    })
} 

// TMSCreateApplication Actions
export const setTMSCARAppCurList = (data) => (dispatch, getState) => {
    dispatch({
        type: TMSCAR_SET_APP_CUR_LIST,
        payload: data
    })
}

export const setTMSCARAppObj = (data) => (dispatch, getState) => {
    dispatch({
        type: TMSCAR_SET_APPLICATION_OBJ,
        payload: data
    })

    if(data.app_id > 0){
        dispatch({
            type: TMSCAR_SET_DISABLE_CREATE,
            payload: false
        });
    }
}

export const mergeTMSCARApp = (data) => (dispatch, getState) => {
    // turn on loading screen 
    dispatch(setLoader({open: true, text: 'Creating new or updating old application...'})); 
    dispatch({
        type: TMSCAR_SET_DISABLE_CREATE,
        payload: true
    }); 
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info; 
    data.user_id = userInfo.id.toUpperCase();  
    data.group_name = data.group_name != null ? data.group_name.map(v => v.label) : [];

    // console.log(data);
    axiosInstance.post(`/tms/tmsweb/mergeApplication`,data)
    .then(r => {   
        popSuccessMessage(r,dispatch,getState);       
        dispatch(setLoader({open: true, text: 'Refreshing data...'}));  

        axiosInstance.get(`/tms/tmsweb/getApplications`)
        .then(res => {  
            var results = res.data;  
            dispatch({
                type: TMSCAR_GET_APPLICATION_LIST,
                payload: results
            }); 
            dispatch(setLoader());  
        }) 
        .catch(err => {
            popErrorMessage(err,dispatch,getState);
        })
        // if the application id exists on the tasks list, task list will be reloaded;
        var list = [...getState().TmsReducer.TMSTDTR.task_info];  
        if( list.some(v => v.APPLICATION_ID === data.app_id) ) {
            var task_columns = getState().TmsReducer.TMSTDTR.task_columns; 
            dispatch({
                type: TMSTDTR_GET_TASK_INFO,
                payload: {
                    task_info: [],
                    task_columns: task_columns,
                    task_loading: true
                }
            })
            axiosInstance.post(`/tms/tmsweb/getTasks`,{
                user_id: userInfo.id.toUpperCase(),
                user_access: userInfo.access,
                user_group_names: userInfo.group_names
            }).then(res => { 
                var results = res.data; 
                
                dispatch({
                    type: TMSTDTR_GET_TASK_INFO,
                    payload: {
                        task_info: results,
                        task_columns: task_columns,
                        task_loading: false
                    }
                }) 
            })
            .catch(err => {
                popErrorMessage(err,dispatch,getState);
            })
        }        
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
} 

export const getTMSCARAppList = () => (dispatch, getState) => {
    dispatch(setLoader({open: true, text: 'Loading application list information...'}));  
    axiosInstance.get(`/tms/tmsweb/getApplications`)
    .then(res => { 
        var results = res.data;  
        dispatch({
            type: TMSCAR_GET_APPLICATION_LIST,
            payload: results
        }); 
        dispatch(setLoader());  
    }).catch(err => {
        popErrorMessage(err,dispatch,getState);
    }) 
     
} 


export const setTMSCARModal = (d) => {
    return {
        type: TMSCAR_SET_MODAL_STATUS,
        payload: d
    }
} 

export const setTMSCARInvalidAppInput = (app_name,app_id) => (dispatch, getState) =>{
    let list = getState().TmsReducer.TMSCAR.application_list;    
    var n = true;
    if(app_id === 0 ) {
        n = list.some(v => v.APPLICATION_NAME.toLowerCase().trim() === app_name.toLowerCase().trim());
    } else {
        n = list.some(v => v.APPLICATION_NAME.toLowerCase().trim() === app_name.toLowerCase().trim() && v.ID !== app_id);
    }
    dispatch({
        type: TMSCAR_SET_INVALID_APP_INPUT,
        payload: n
    });  
    n = (app_name.length === 0) ? true : n;
    dispatch({
        type: TMSCAR_SET_DISABLE_CREATE,
        payload: n
    }); 
} 


// TMSCreateTask Actions
export const resetTMSCT = () => (dispatch, getState) => {
    dispatch({
            type: TMSCT_SET_APPLICATION_NAME,
            payload: {
                application_name:''
            }
        });
        dispatch({
            type: TMSCT_SET_DISABLE_TASK_GROUP,
            payload: {
                disable_task_group: true
            }
        })
        dispatch({
            type: TMSCT_SET_DISABLE_TASK_NAME,
            payload: {
                disable_task_name: true
            }
        }); 
        dispatch({
            type: TMSCT_SET_TASKGROUP_LIST,
            payload: []
        })
        dispatch({
            type: TMSCT_SET_TASK_GROUP,
            payload: {
                task_group:''
            }
        });
        dispatch({
            type: TMSCT_SET_TASK_LIST,
            payload: {
                task_list:[]
            }
        })
        dispatch(setLoader());  
}
export const setTMSCTDeletedTasks = (data) => (dispatch, getState) => { 
    var arr = [...getState().TmsReducer.TMSCTR.task_list_deleted];
    data.task_record_status = 'DELETED'
    arr.push(data);
    dispatch({
        type: TMSCT_SET_TASK_LIST_DELETED,
        payload: arr
    })
} 

export const mergeTMSCTTasks = () => (dispatch, getState) => {
    var userInfo = getState().TmsReducer.TMSMR.logged_user_info; 
    dispatch(setLoader({open: true, text: 'Creating new or updating existing tasks. Please wait...'}));  

    var list = [...getState().TmsReducer.TMSCTR.task_list];
    var delList = [...getState().TmsReducer.TMSCTR.task_list_deleted];


    list.forEach((item,index) => { 
        list[index].user_id = userInfo.id.toUpperCase();
        list[index].task_sequence = index + 1;
    }) 

    list.push(...delList); 
    axiosInstance.post(`/tms/tmsweb/mergeTask`,{ task_info_array: list })
    .then(res => {  
        popSuccessMessage(res,dispatch,getState);
        dispatch({
            type: TMSCT_SET_APPLICATION_NAME,
            payload: {
                application_name:''
            }
        });
        dispatch({
            type: TMSCT_SET_DISABLE_TASK_GROUP,
            payload: {
                disable_task_group: true
            }
        })
        dispatch({
            type: TMSCT_SET_DISABLE_TASK_NAME,
            payload: {
                disable_task_name: true
            }
        }); 
        dispatch({
            type: TMSCT_SET_TASKGROUP_LIST,
            payload: []
        })
        dispatch({
            type: TMSCT_SET_TASK_GROUP,
            payload: {
                task_group:''
            }
        });
        dispatch({
            type: TMSCT_SET_TASK_LIST,
            payload: {
                task_list:[]
            }
        })
        dispatch(resetTMSCT());
        dispatch(setTMSMRObj({obj:{},value:'home'}));
        dispatch(setLoader()); 
    })
    
}

export const getTMSCTTaskPerGroup = (id) => (dispatch, getState) => {

    if(id > 0){
        dispatch(setLoader({open: true, text: 'Retrieving tasks under this task group...'}));  
        axiosInstance.post(`/tms/tmsweb/getTasksPerTaskGroup`,{
            task_group_id: id
        })
        .then(r => { 
            var res = r.data;   
            var arr = [];
            res.forEach((item) => {
                var obj = {}
                Object.keys(item).forEach((key) => {
                    obj[key.toLocaleLowerCase()] = item[key];
                })
                obj.edit = false;
                arr.push(obj);
            }) 
            dispatch({
                type: TMSCT_SET_TASK_LIST,
                payload: {
                    task_list:arr
                }
            })
            dispatch(setLoader());   
        })
    } else {
        dispatch({
            type: TMSCT_SET_TASK_LIST,
            payload: {
                task_list:[]
            }
        })
    }
    
}

export const getTMSCTTaskGroup = () => (dispatch, getState) =>{
    getTaskGroupInfo(dispatch, getState,{});
}

export const setTMSCTRTaskGroupList = (app) => (dispatch, getState) => {
    getTaskGroupList(app,dispatch, getState);
}

export const setTMSCTTaskName = (task_name) => (dispatch, getState) => { 
    let list = getState().TmsReducer.TMSCTR.task_list;
    var n = list.some(v => v.task_name.toLowerCase().trim() === task_name.toLowerCase().trim());
    dispatch({
        type: TMSCT_SET_DISABLE_TASK_DESC,
        payload: {
            disable_task_desc:(task_name.length === 0 || n)
        }
    });
    dispatch({
        type: TMSCT_SET_TASK_NAME,
        payload: {
            task_name:task_name
        }
    });
    dispatch({
        type: TMSCT_SET_DISABLE_ADD_BUTTON,
        payload: {
            disable_add_button:(task_name.length === 0 || n),
            invalid_task: n
        }
    });
    dispatch({
        type: TMSCT_SET_DISABLE_IS_MANDATORY,
        payload: {
            disable_is_mandatory:(task_name.length === 0 || n)
        }
    });
} 

export const setTMSCTTaskDesc = (task_desc) => (dispatch) =>{  
    dispatch({
        type: TMSCT_SET_TASK_DESC,
        payload: {
            task_desc:task_desc
        }
    });
} 

export const setTMSCTAppName = (application_name) => (dispatch) =>{ 
    dispatch({
        type: TMSCT_SET_DISABLE_TASK_GROUP,
        payload: {
            disable_task_group:(application_name.length === 0)
        }
    })
    dispatch({
        type: TMSCT_SET_APPLICATION_NAME,
        payload: {
            application_name:application_name
        }
    });
} 
 
export const setTMSCTTaskGroup = (task_group) => (dispatch) =>{ 
    dispatch({
        type: TMSCT_SET_DISABLE_TASK_NAME,
        payload: {
            disable_task_name:(task_group.length === 0)
        }
    }); 
    dispatch({
        type: TMSCT_SET_TASK_GROUP,
        payload: {
            task_group:task_group
        }
    });
} 

export const setTMSCTTaskList = (d) => (dispatch,getState) => {
    dispatch({
        type: TMSCT_SET_TASK_LIST,
        payload: {
            task_list: []
        }
    }) 
    dispatch({
        type: TMSCT_SET_TASK_LIST,
        payload: {
            task_list: d
        }
    }) 
} 

export const spliceTMSCTTaskList = (index) => (dispatch,getState) => {
    let taskList = getState().TmsReducer.TMSCTR.task_list;
    taskList.splice(index,1);   
    dispatch({
        type: TMSCT_SET_TASK_LIST,
        payload: {
            task_list: taskList
        }
    })
}

// TMSActionDataTable
export const setTMSADTRDialogDelete = (data) => (dispatch,getState) => { 
    dispatch({
        type: TMSADTR_SET_DIALOG_DELETE,
        payload: data
    })
}

export const setTMSADTRFileList = (id) => (dispatch,getState) => { 
    dispatch(setLoader({open: true, text: 'Retrieving files under this action. Please wait...'}));  
    axiosInstance.post(`/tms/tmsweb/getFiles`,{
        id_link: id,
        table_name_link: 'TMS_ACTION'
    })
    .then(r => {  
        var toggle = {...getState().TmsReducer.TMSADTR.action_show_file_list}.toggle;
        dispatch({
            type: TMSADTR_SET_SHOW_FILE_LIST,
            payload: {
                file_list: r.data,
                toggle: !toggle                
            }
        })
        dispatch(setLoader());  
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
    
}

export const downloadFile = (fileLocation,fileName) => (dispatch,getState) => { 
    dispatch(setLoader({open: true, text: 'Downloading file. Please wait...'}));  
    axiosInstance.post(`/tms/tmsweb/downloadFile`,{
        file_location: fileLocation 
    },{
        responseType: 'arraybuffer'
    })
    .then(r => {   
        const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); //or any other extension
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        dispatch(setLoader());  
    })
    .catch(err => {
        popErrorMessage(err,dispatch,getState);
    })
}

// for TMS PPI Action module
export const setTMSPPIAARShowModal = (data) => (dispatch,getState) => { 
    dispatch({
        type: TMSPPIAAR_SET_SHOW_MODAL,
        payload: data
    })
}

export const setTMSPPIAARShortageInfo = (data) => (dispatch,getState) => {
    // the object should look like this do not replace the properties
    data = {
        region: 'Korea',
        subcon: 'ANA',
        atss_id: 'SID101390600',
        material: 'SUBSTRATE',
        as_of_date: '10/01/2020'
    }

    dispatch({
        type: TMSPPIAAR_SET_SHORTAGE_INFO,
        payload: data
    })
}

// export const mergeTMSPPIAARShortageComment = (data) => (dispatch,getState) => {
//     dispatch(setLoader({open: true, text: 'Merging shortage comment. Please wait...'}));  
//     var mergeData = {...getState().TmsReducer.TMSPPIAAR.shortage_info};
//     // data is the shortage comment
//     mergeData.shortage_comment = data;
//     mergeData.status = "CLOSED"; // for the mean time since requirement only needs CLOSED
//     mergeData.user_id = "X0137581"; // logged in user
//     // console.log(mergeData);

//     // TMS endpoint 
//     axiosInstance.post(`/tms/tmsweb/mergePPIShortageComment`,mergeData)
//     .then(r => {    
//         dispatch(setLoader());  
//     })
//     .catch(err => {
//         popErrorMessage(err,dispatch,getState);
//     })
// }