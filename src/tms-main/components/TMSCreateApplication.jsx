import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter
    , InputGroup, InputGroupAddon, Input, FormGroup, InputGroupText
    , ListGroup, ListGroupItem, Tooltip, ListGroupItemHeading, ListGroupItemText
    } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { setTMSCARModal
    , setTMSCARInvalidAppInput 
    , mergeTMSCARApp
    , setTMSCARAppObj
    , setTMSCARAppCurList
    } from '../actions/TMSActions';
import TMSRequiredAddOn from './TMSRequiredAddOn.jsx' 
import ToolTipCustom from './TMSToolTipCustom.jsx';
import IconBack from '../resources/images/back.svg';  
import IconEdit from '../resources/images/edit.svg';
import IconNew from '../resources/images/new.svg';
import IconProceedEdit from '../resources/images/proceed_edit.svg'; 
import Select from 'react-select';

const ListGroupAppList = ({list}) => {
    const appObj = useSelector( state => state.TmsReducer.TMSCAR.obj);
    const dispatch = useDispatch();
    let ListGroupApp = list.map((item,index) => {
        const onClickButtonEditApp = () => {  
            var arr = (item.GROUP_NAME !== null) ? item.GROUP_NAME.split(';').map(v => { return({label: v, value: v}) }) : [];
            dispatch(setTMSCARAppObj({
                app_name: item.APPLICATION_NAME,
                app_url: (item.APPLICATION_URL === null) ? '' : item.APPLICATION_URL,
                app_id: item.ID,
                is_active: item.IS_ACTIVE,
                group_name: arr
            }))
        }

        var activeCheckMessage = (item.IS_ACTIVE === "1") ? 'Application is active.' : 'Application is inactive.';
        return (
            <InputGroup className="flex-no-wrap">
                <ListGroupItem key={`LGIAppList-${index}`}> 
                    <ListGroupItemHeading className="list-heading">
                        <div id={`DivIsActiveCheck-${index}`} className={(item.IS_ACTIVE === "1") ? `check-active check-active-yes` : `check-active check-active-no`}></div>
                        {item.APPLICATION_NAME} [Group count: {item.GROUP_CNT}]
                        <ToolTipCustom componentId={`DivIsActiveCheck-${index}`} message={`${activeCheckMessage}`} placement={"bottom"}/>
                    </ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {item.APPLICATION_URL}
                    </ListGroupItemText> 
                </ListGroupItem > 
                {
                    (appObj.app_id === 0) && <InputGroupAddon addonType="append">
                        <Button color="success" id={`ButtonEditApp-${index}`} 
                            onClick={onClickButtonEditApp}>
                            <img id={`IconEditApp`} src={IconEdit} className="button-icon" alt=""/> 
                            <ToolTipCustom componentId={`ButtonEditApp-${index}`} message={"Edit application."}/>
                        </Button>
                    </InputGroupAddon>
                }
                
            </InputGroup>
        );
    }) 

    return(
        <ListGroup>
            {ListGroupApp}
        </ListGroup>
    );
}

const TMSCreateApplication = () => {  
    const obj = {
        app_name: '',
        app_url: '',
        app_id: 0,
        is_active: 1,
        group_name: []
    }
    const appObj = useSelector( state => state.TmsReducer.TMSCAR.obj);
    const openModal = useSelector( state => state.TmsReducer.TMSCAR.open_modal);
    const invalidAppInput = useSelector( state => state.TmsReducer.TMSCAR.invalid_app_input);
    const disCreate = useSelector( state => state.TmsReducer.TMSCAR.disable_create); 
    const appList = [...useSelector( state => state.TmsReducer.TMSCAR.application_list)];
    const groupNameList = [...useSelector( state => state.TmsReducer.TMSCAR.group_name_cur_list)];
    const curAppList = [...appList];
    const [openMenu,setOpenMenu] = useState(false);
    const dispatch = useDispatch();
    var title = (appObj.app_id === 0) ? 'Create new application data' : 'Modify application data';
    
    useEffect(()=>{ 
        dispatch(setTMSCARAppCurList([...curAppList])); 
        // eslint-disable-next-line
    },[curAppList.length,appObj.app_id])

    const toggle = () => {        
        dispatch(setTMSCARModal(!openModal));
        dispatch(setTMSCARAppCurList([...curAppList])); 
        dispatch(setTMSCARAppObj({...obj}));
        dispatch(setTMSCARInvalidAppInput(obj.app_name,obj.app_id));       
    }    

    const onChangeAppName = (e) => { 
        var v = e.target.value;
        var arr = [...appList];  
        dispatch(setTMSCARInvalidAppInput(v,appObj.app_id));
        dispatch(setTMSCARAppCurList(arr.filter((item) => item.APPLICATION_NAME.toLowerCase().includes(v.toLowerCase())))); 
        dispatch(setTMSCARAppObj({...appObj,app_name:v})); 
    }

    const onChangeAppUrl = (e) => {
        var v = e.target.value;
        dispatch(setTMSCARAppObj({...appObj,app_url:v}));
    }

    const onClickButtonCreate = () => { 
        dispatch(setTMSCARAppCurList([...curAppList])); 
        dispatch(mergeTMSCARApp(appObj));
        dispatch(setTMSCARAppObj({...obj}));     
    }

    const onClickBack = () => {
        dispatch(setTMSCARAppCurList([...curAppList])); 
        dispatch(setTMSCARAppObj({...obj}));
        dispatch(setTMSCARInvalidAppInput(obj.app_name,obj.app_id));        
    } 

    const onChangeIsActive = (e) => { 
        var v = (e.target.checked) ? "1" : "0";
        dispatch(setTMSCARAppObj({...appObj,is_active:v}));
    }

    const onChangeGroupName = (e) => {
        dispatch(setTMSCARAppObj({...appObj,group_name:e}));
    }

    const customStyles = {
        valueContainer: base => ({
            ...base,
            height: 60, 
            overflow: 'auto', 
            alignItems: 'start'
        }),
        placeholder: base => ({
            ...base,
            top: 17
        })
    };

    return (
    <div> 
        <Modal id="TMSModalHeader" isOpen={openModal} toggle={toggle} centered={true} backdrop={"static"}>
        <ModalHeader className={(appObj.app_id === 0) ? `` : `tms-modal-header-edit`}>{title}</ModalHeader>
        <ModalBody id="ModalBodyCreateApplication">
            <FormGroup >   
                <InputGroup className="top-input">
                    <TMSRequiredAddOn text={"Application name"}/> 
                    <Input id="InputAppName" invalid={invalidAppInput} placeholder="Enter the application name here..." value={appObj.app_name} onChange={onChangeAppName}/> 
                    <Tooltip placement="right" isOpen={invalidAppInput} target={"InputAppName"} >
                        The application name already exists! Kindly try again.
                    </Tooltip>  
                    {
                    (appObj.app_id > 0) && <InputGroupAddon addonType="append">   
                        <InputGroupText className="inputgrouptext-check-box-append"> 
                            <Input id="CheckboxIsActive" type="checkbox" className="check-box-append" 
                                checked={(appObj.is_active === "1" ? true : false)}
                                onChange={onChangeIsActive}
                            />  
                            <ToolTipCustom componentId={"CheckboxIsActive"} message={"Check if application is active else inactive."}/>
                        </InputGroupText>      
                    </InputGroupAddon>
                    }
                </InputGroup>
                <InputGroup className="top-input">
                    <InputGroupAddon addonType="prepend">Application website</InputGroupAddon>
                    <Input id="InputAppLink" disabled={disCreate} placeholder="Enter the web link name here..." value={appObj.app_url} onChange={onChangeAppUrl}/>  
                </InputGroup>
                <InputGroup id="InputGroupAppGroupName">
                    <TMSRequiredAddOn text={"User group"}/>
                    <Select isClearable={true} isDisabled={disCreate} isMulti={true} options={groupNameList} 
                        value={appObj.group_name}
                        placeholder="Select one or more..."
                        styles={customStyles}
                        menuIsOpen={openMenu}
                        onChange={onChangeGroupName}
                        onFocus={()=>{setOpenMenu(true)}}
                        onBlur={()=>{setOpenMenu(false)}}
                        id="SelectUserGroup" className="react-select-style"/>
                </InputGroup>
                
            </FormGroup> 
            <InputGroupAddon addonType="prepend" className="max-w" >Applications that already on the system</InputGroupAddon>         
            <div className="app-list"> 
                <ListGroupAppList list={curAppList}/>
            </div>
            
        </ModalBody>
        <ModalFooter id="TMSModalFooter">
            {
                (appObj.app_id > 0) && <Button color="secondary" className="main-buttons"
                    onClick={onClickBack}>
                    <img id={`IconBack`} src={IconBack} className="button-icon" alt=""/>  Back
                </Button>
            }
            {
                (appObj.app_id > 0) && <Button color="success" className="main-buttons"
                    disabled={invalidAppInput}
                    onClick={onClickButtonCreate}>
                    <img id={`IconProceedEdit`} src={IconProceedEdit} className="button-icon" alt=""/>  Modify
                </Button>
            }
            {
                (appObj.app_id === 0) && <Button color="primary" disabled={(disCreate || appObj.group_name.length === 0)} 
                    size="sm" className="main-buttons" 
                    onClick={onClickButtonCreate}>
                    <img id={`IconNew`} src={IconNew} className="button-icon" alt=""/>  Create
                </Button>
            }
            
            {' '}
            <Button color="danger" size="sm" className="main-buttons" onClick={toggle}>
                <FontAwesomeIcon icon={faDoorOpen} className="main-button-icon" />Close
            </Button>  
        </ModalFooter>
        </Modal>
    </div>
    );
}

export default TMSCreateApplication;