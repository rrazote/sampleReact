import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';
import { Button, InputGroup, InputGroupAddon, Input, Modal
    , ModalHeader, ModalBody, ModalFooter, InputGroupText
    , ListGroupItem, ListGroupItemHeading, ListGroupItemText
    , ListGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 

import ToolTipCustom from './TMSToolTipCustom.jsx'   
import TMSRequiredAddOn from './TMSRequiredAddOn.jsx'   
import IconProceedEdit from '../resources/images/proceed_edit.svg'; 
import IconBack from '../resources/images/back.svg'; 
import IconEdit from '../resources/images/edit.svg'; 

import {  
    setTMSAARSetStatusData,
    mergeTMSAARMergeStatus, 
    setTMSAARShowCreateStatus
    } from '../actions/TMSActions'; 

const ListStatus = ({list}) => {
    const dispatch = useDispatch();
    const statId = useSelector(state => state.TmsReducer.TMSAAR.status_data.id);
    let ListItems = list.map((item,index) => { 
        const onClickButtonEdit = (e) => {
            dispatch(setTMSAARSetStatusData({
                id: item.ID,
                status: item.STATUS,
                status_desc: item.STATUS_DESC,
                status_type: {label: item.TYPE, value: item.TYPE},
                old_status: item.STATUS,
                is_active: item.IS_ACTIVE
            }))
        }
        return (
            <InputGroup className="flex-no-wrap">
                <ListGroupItem > 
                    <ListGroupItemHeading className="list-heading">
                        <div id={`DivIsActiveCheck-${index}`} className={(item.IS_ACTIVE === "1") ? `check-active check-active-yes` : `check-active check-active-no`}/>
                        {item.STATUS} [{item.TYPE}]
                    </ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {item.STATUS_DESC}
                    </ListGroupItemText>  
                </ListGroupItem >
                {
                    (statId === 0 ) && <InputGroupAddon addonType="append">
                    <Button color="success" id={`ButtonEditStatus-${index}`}
                        onClick={onClickButtonEdit}>
                        <img id={`IconEditStatus`} src={IconEdit} className="button-icon" alt=""/> 
                        <ToolTipCustom componentId={`ButtonEditStatus-${index}`} message={"Edit status."}/>
                    </Button>
                </InputGroupAddon>
                
                }
            </InputGroup>
             
            
        );
    }) 

    return(
        <ListGroup>
            {ListItems}
        </ListGroup>
    );
}

const TMSCreateStatus = ({toggle}) => {
    const statusInfo = [...useSelector(state => state.TmsReducer.TMSMR.status_defs)] 
    const statusData = {...useSelector(state => state.TmsReducer.TMSAAR.status_data)}
    const [statusType,setStatusType] = useState([]);
    const [open, setOpen] = useState(false);
    const [statusObj,setStatusObj] = useState({ 
        invalid_status: false, 
    });  
    const isFirstRun = useRef(true); 
    const dispatch = useDispatch();
    useEffect(()=>{
        var arr = [...statusInfo].map(v => { return({label:v.TYPE,value:v.TYPE}) });
        let distinct = arr.filter((v,i,a)=>a.findIndex(t=>(t.label === v.label))===i) 
        setStatusType(distinct);

        if(statusData.id === 0) {
            dispatch(setTMSAARSetStatusData({cur_status_info: [...statusInfo]}))
        } else {
            var curArr = [...statusInfo].filter((item) => item.STATUS.toLowerCase().includes(statusData.status.toLowerCase()) 
                && item.TYPE === statusData.status_type.label); 
             dispatch(setTMSAARSetStatusData({cur_status_info: curArr}))
        }
        
        if(isFirstRun.current){
            isFirstRun.current = false; 
        } else { 
            if(toggle){
                setOpen(true)
            }
        }
        // eslint-disable-next-line
    },[toggle,statusInfo.length,statusData.id])

    const onChangeInputStatusName = (e) => {
        var v = e.target.value; 
        var arr = [...statusInfo].filter((item) => item.STATUS.toLowerCase().includes(v.toLowerCase()) 
            && item.TYPE === statusData.status_type.label);  
        var n = false;
        if(statusData.id === 0){
            n = statusInfo.some(item => item.STATUS.toLowerCase().trim() === v.toLowerCase().trim() 
                && item.TYPE === statusData.status_type.label); 
        } else {
            n = statusInfo.some(item => item.STATUS.toLowerCase().trim() === v.toLowerCase().trim() 
                && item.TYPE === statusData.status_type.label
                && item.ID !== statusData.id); 
        }
        
        setStatusObj({...statusObj, 
            invalid_status: n 
        })
        dispatch(setTMSAARSetStatusData({status:v.toUpperCase(), cur_status_info: arr}))
    }

    var title = (statusData.id === 0) ? 'Add status data' : `Modifying status ${statusData.old_status}`;

    const onClickBack = () => {
        dispatch(setTMSAARSetStatusData({
            id: 0,
            status: '',
            status_desc: '',
            status_type: '',
            old_status: ''
        }))
        setStatusObj({...statusObj, 
            invalid_status: false
        })
    }

    const onChangeStatusType = (e) => {
        var arr = [...statusInfo];
        if(e !== '' && e !== null) {               
            arr = arr.filter((item) => item.TYPE.toLowerCase().includes(e.label.toLowerCase())); 
            dispatch(setTMSAARSetStatusData({ 
                status_type: e,
                cur_status_info: arr 
            }))
        } else { 
            dispatch(setTMSAARSetStatusData({ 
                status: '',
                status_desc: '',
                status_type: e,
                cur_status_info: arr 
            }))
        }
    }

    const onChangeIsActive = (e) => { 
        var v = (e.target.checked) ? "1" : "0";
        dispatch(setTMSAARSetStatusData({is_active:v}));
    }

    const onClickClose = (e) => {
        dispatch(setTMSAARShowCreateStatus(false));
        dispatch(setTMSAARSetStatusData({
            id: 0,
            status: '',
            status_desc: '',
            status_type: '',
            old_status: ''
        }))
        setStatusObj({...statusObj, 
            invalid_status: false
        })
        setOpen(!open);
    }

    const onClickMerge = (e) => {
        dispatch(mergeTMSAARMergeStatus());
    }

    return(
        <React.Fragment>
            <Modal id="TMSModalHeader" isOpen={open} centered={true} backdrop={"static"}>
            <ModalHeader className={(statusData.id === 0) ? `` : `tms-modal-header-edit`}>{title}</ModalHeader>
            <ModalBody className="style-column" id="ModalBodyAddStatus">
                <InputGroup className="flex-no-wrap">
                    <TMSRequiredAddOn text={"Type"}/> 
                    <Select isClearable={true} className="react-select-style" options={statusType}
                        value={statusData.status_type}
                        isDisabled={(statusData.id > 0)}
                        onChange={onChangeStatusType}/> 
                </InputGroup>
                <InputGroup className="flex-no-wrap">
                    <TMSRequiredAddOn text={"Status"}/>  
                    <Input id="InputStatusName" placeholder="Enter the status name here..." 
                        invalid={(statusObj.invalid_status)}
                        disabled={(statusData.status_type === '')}
                        value={statusData.status}
                        onChange={onChangeInputStatusName}/> 
                    {
                    (statusData.id > 0) && <InputGroupAddon addonType="append">   
                        <InputGroupText className="inputgrouptext-check-box-append"> 
                            <Input id="CheckboxStatusIsActive" type="checkbox" className="check-box-append" 
                                checked={(statusData.is_active === "1" ? true : false)}
                                onChange={onChangeIsActive}
                            />  
                            <ToolTipCustom componentId={"CheckboxStatusIsActive"} message={"Check if status is active else inactive."}/>
                        </InputGroupText>      
                    </InputGroupAddon>
                    }
                    
                </InputGroup>
                <InputGroup className="flex-no-wrap">
                    <InputGroupAddon addonType="prepend">Status Description</InputGroupAddon>
                    <Input id="InputStatusDesc" type="textarea" placeholder="Enter the status description..."
                        value={statusData.status_desc}
                        disabled={statusData.status.length === 0}
                        onChange={(e)=>{dispatch(setTMSAARSetStatusData({status_desc:e.target.value}))}}/> 
                </InputGroup>
                <InputGroupAddon addonType="prepend" className="max-w" >Status that are on the system</InputGroupAddon>   
                <div className="status-list"> 
                    <ListStatus list={statusData.cur_status_info}/>
                </div>
            </ModalBody>
            <ModalFooter id="TMSModalFooter">
                {
                    (statusData.id !== 0) && <Button color="secondary" className="main-buttons"
                        onClick={onClickBack}>
                        <img id={`IconBack`} src={IconBack} className="button-icon" alt=""/>  Back
                    </Button>
                }
                {
                    (statusData.id !== 0) && <Button color="success" className="main-buttons"
                        disabled={statusData.status.length === 0 || statusObj.invalid_status}
                        onClick={onClickMerge}>
                        <img id={`IconProceedEdit`} src={IconProceedEdit} className="button-icon" alt=""/>  Modify
                    </Button>
                }
                {
                    (statusData.id === 0) && <Button color="primary" className="main-buttons"
                        disabled={statusData.status.length === 0 || statusObj.invalid_status}
                        onClick={onClickMerge}>
                        <FontAwesomeIcon icon={faSave} /> Save
                    </Button> 
                }
                <Button color="danger" className="main-buttons" onClick={onClickClose}>
                    <FontAwesomeIcon icon={faDoorOpen} /> Close
                </Button> 
            </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}
 
export default TMSCreateStatus;