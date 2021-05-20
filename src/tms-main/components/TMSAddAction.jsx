import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { Button, InputGroup, InputGroupAddon, Input,
    Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faDoorOpen, faEraser } from '@fortawesome/free-solid-svg-icons'; 

import ToolTipCustom from './TMSToolTipCustom.jsx'  
import TMSEmailSearch from './TMSEmailSearch.jsx' 
import TMSRequiredAddOn from './TMSRequiredAddOn.jsx'  
import IconAddUploadFile from '../resources/images/add_upload_file.svg';   
import IconNew from '../resources/images/new.svg';

import { 
    setTMSAARUploadArray,
    setTMSMRObj, 
    setTMSAARSetActionData,  
    mergeTMSAARMergeAction,
    setTMSAARShowCreateStatus
    } from '../actions/TMSActions'; 
 
const TMSFileUploadRow = ({index,item,fileList,callback,disabled}) => {    
    const uploadList = [...useSelector(state => state.TmsReducer.TMSAAR.upload_array)]; 
    const dispatch = useDispatch();   
    const onChangeUploadFile = (e) => { 
        var arr = [...fileList]; 
        var file = Array.from(e.target.files);
        var i = arr.some(v => v.name === file[0].name); 
        if(i){            
            document.getElementById(`InputUploadFile-${index}`).value = null;
        } else {
            arr[index]=file[0];          
            callback(arr);
        }
    }
    const onButtonClickDeleteAttachment = () => {  
        uploadList.splice(uploadList.indexOf(item),1); 
        dispatch(setTMSAARUploadArray(uploadList)); 
        document.getElementById(`InputUploadFile-${index}`).value = null 
        var arr = [...fileList]; 
        arr.splice(index,1);
        callback(arr);
    } 
    return (
        <React.Fragment>
        {
            (uploadList.indexOf(item) > -1) && <tr key={`tr-upload-${index}`}>
                <td className="style-row">
                    <Input type="file" id={`InputUploadFile-${index}`} name={`add-uploadfile-${index}`} onChange={onChangeUploadFile} disabled={disabled}/> 
                    {
                    (uploadList.length > 1) && <Button id={`ButtonRemoveUpload-${index}`} color="danger" className="button-upload-delete"
                        onClick={()=>{onButtonClickDeleteAttachment()}}>
                        <FontAwesomeIcon icon={faEraser} className="button-upload-delete-icon"/>
                        <ToolTipCustom componentId={`ButtonRemoveUpload-${index}`} message={"Delete attachment."}/>
                    </Button>
                    }
                     
                </td>
            </tr>
        }
        </React.Fragment>
    );
}

const TMSFileUpload = ({list,fileList,callback,disabled}) => { 
    
    let InputFileUpload = list.map((item,index) => {      
        return (
            <TMSFileUploadRow index={index} item={item} fileList={fileList} callback={callback} disabled={disabled}/>
        );
    }) 

    return (
        <table className="file-upload">
            <tbody>
                {InputFileUpload}
            </tbody>
        </table>
    );
}

const TMSAddAction = () => {      
    var maxLength = 1000;
    const dispatch = useDispatch();
    var toggle = useSelector(state => state.TmsReducer.TMSAAR.show_create_status);
    const [uploadIndex, setUploadIndex] = useState(1); 
    const [textAreaCount,setTextAreaCount] = useState(maxLength);
    var [fileList,setFileList] = useState([]);
    var userInfo = useSelector(state => state.TmsReducer.TMSMR.logged_user_info);
    const homeObj = {...useSelector(state => state.TmsReducer.TMSMR.obj)}; 
    const statusSelection = [...useSelector(state => state.TmsReducer.TMSAAR.status_selection)];   
    const uploadList = [...useSelector(state => state.TmsReducer.TMSAAR.upload_array)]; 
    var actionData = {...useSelector(state => state.TmsReducer.TMSAAR.action_data)}; 
    var toggleAddAction =  useSelector( state => state.TmsReducer.TMSMR.obj.show_add_action);  
    const [actionStatus, setActionStatus] = useState('');

    useEffect(() => {  
        setActionStatus(''); 
        setFileList([]);
    },[actionData.action_refresh])

    const onButtonClickClose = () => {   
        dispatch(setTMSMRObj({obj:homeObj,value:'close_action'}));
        dispatch(setTMSAARSetActionData({  
            action_id: 0,
            merge_type: '', 
            action_status: '',
            action_name: '', 
            action_comment: '' 
        }));
    } 
    

    const onButtonClickAddUploadFile = () => {
        var index = uploadIndex + 1; 
        uploadList.push(index);
        dispatch(setTMSAARUploadArray(uploadList));
        setUploadIndex(index);
        fileList.push({});
        setFileList(fileList);
    }

    const onButtonClickAddAction = (e) => {    
        dispatch(setTMSAARSetActionData({merge_type: 'INSERT'}))
        dispatch(mergeTMSAARMergeAction(fileList,0)); 
    }

    const onInputChangeActionComment = (e) => {
        setTextAreaCount(e.target.maxLength - e.target.value.length);
        dispatch(setTMSAARSetActionData({action_comment: e.target.value}));
    }

    const onChangeActionStatus = (e)=>{
        setActionStatus((e != null ) ? e : '');            
        if(e != null) {
            dispatch(setTMSAARSetActionData({action_status: (e != null ) ? e.label : null}))
        } 
    }

    return ( 
        <Modal id="TMSModalHeader" className="tms-modal-add-action" isOpen={toggleAddAction} centered={true} backdrop={"static"}>
        <ModalHeader>Add New Action</ModalHeader>
        <ModalBody id="ModalBodyAddAction">
            <div className="style-column" id="DivAddAction">   
                <InputGroup className="flex-no-wrap">
                    <TMSRequiredAddOn text={"Select status"}/>
                    <Select isClearable={true} isDisabled={false}  options={statusSelection} id="InputActionStatus" className="react-select-style" defaultValue={""} 
                        value={actionStatus}
                        onChange={onChangeActionStatus}/>            
                    {
                    (userInfo.access === 'admin') && <InputGroupAddon addonType="append">
                        <Button id="ButtonAddActionStatus" color="primary" className="button-new"
                            onClick={()=>{dispatch(setTMSAARShowCreateStatus(!toggle))}}>
                            <img src={IconNew} className="button-icon" alt=""/> 
                        </Button>
                        <ToolTipCustom componentId={"ButtonAddActionStatus"} message={"Create new status or modify existing ones."}/>   
                    </InputGroupAddon>
                    }
                </InputGroup>

                <InputGroup className="flex-no-wrap">
                    <TMSRequiredAddOn text={"Action name"}/> 
                    <Input id="InputActionName" placeholder="Enter the action name here..." 
                        disabled={(actionData.action_status === '')}
                        value={actionData.action_name}
                        onChange={(e)=>{dispatch(setTMSAARSetActionData({action_name: e.target.value}))}}/> 
                </InputGroup> 

                <InputGroup className="flex-no-wrap">
                    <InputGroupAddon addonType="prepend">Attached Files</InputGroupAddon>
                    <div className="style-column div-upload">
                        <TMSFileUpload list={uploadList} fileList={fileList} callback={setFileList} disabled={(actionData.action_name === '')}/>  
                    </div>
                    <Button id="ButtonAddFile" color="success"
                        disabled={(actionData.action_name === '')}
                        onClick={onButtonClickAddUploadFile}>
                        <img id={`IconAddUploadFile`} src={IconAddUploadFile} className="button-icon" alt=""/> 
                    </Button>
                    <ToolTipCustom componentId={"ButtonAddFile"} message={"Add additional file."}/>
                </InputGroup> 

                <InputGroup className="flex-no-wrap">
                    <TMSRequiredAddOn text={"Action Comment"}/>  
                    <Input id="InputActionComment" type="textarea" maxLength={maxLength} placeholder="Enter the action comment..."
                        disabled={(actionData.action_name === '')}
                        value={actionData.action_comment}
                        onChange={onInputChangeActionComment}/> 
                    <ToolTipCustom componentId={"InputActionComment"} message={`You can only enter ${textAreaCount} character(s).`}/>
                </InputGroup> 

                <TMSEmailSearch id={"AddActionEmailTo"} multi={true} title={"Recipients to be notified"} stateSelectedName={"to"} store={"action_email_store"} disabled={(actionData.action_name === '')}/>
                
                <TMSEmailSearch id={"AddActionEmailCC"} multi={true} title={"Emails to be carbon copied"} stateSelectedName={"cc"} store={"action_email_store"} disabled={(actionData.action_name === '')}/>
            </div>

        </ModalBody>
        <ModalFooter id="TMSModalFooter">
            <div className="footer-buttons">
                <Button color="primary" size="sm" className="main-buttons"
                    disabled={(actionData.status === '' || actionData.action_name === '' || actionData.action_comment === '' )}
                    onClick={onButtonClickAddAction}>
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

export default TMSAddAction;