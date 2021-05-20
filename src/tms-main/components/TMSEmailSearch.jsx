import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter
    , InputGroup, InputGroupAddon, Input, FormGroup 
    , ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
    , ButtonGroup, Alert} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { DangerButton } from 'ti-react-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faAddressCard, faUserPlus, faPlus, faCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import {  
    setTMSESROpenEmailSearch, 
    setTMSESRSearchValue,
    getTMSESRModal,
    addTMSESRUMSEmail, 
    setTMSESRSelectedValue,
    setTMSESRModalValues,
    setTMSESRMultiValue,
    resetTMSESR
} from '../actions/TMSActions';  
import ToolTipCustom from './TMSToolTipCustom.jsx'
import TMSRequiredAddOn from './TMSRequiredAddOn.jsx'
import '../resources/css/tms-ui.css';

const ListTaskGroup = () => {
    const dispatch = useDispatch();
    const multi = useSelector(state => state.TmsReducer.TMSESR.is_multi);  
    const list = useSelector( state => state.TmsReducer.TMSESR.ldap_result);  
    const activeItems = useSelector(state => state.TmsReducer.TMSESR.multi_value); 

    const onClickButtonAdd = (item) => {  
        dispatch(addTMSESRUMSEmail(item));  
        dispatch(resetTMSESR());
    }
    
    const onClickButtonAddItems = (item) => {
        const index = activeItems.map( v => {return v.USER_EMAIL}).indexOf(item.USER_EMAIL);
        if (index < 0) {
            activeItems.push(item);
        } else {
            activeItems.splice(index,1);
        }
        dispatch(setTMSESRMultiValue([...activeItems]));
    }

    const checkItem = (activeItems,item) => {
        return ((activeItems.map( v => {return v.USER_EMAIL}).indexOf(item.USER_EMAIL)) >= 0);
    }

    let ListGroupApp = list.map((item,index) => { 
        var id = ((item.USER_ID.toString().trim().length === 0 ) ? "" : `(${item.USER_ID}) ` ); 
        var desc = id + item.USER_FULL_NAME;
        return (
             <InputGroup key={`email-inputgroup-list-${index}`}> 
                <ListGroupItem className={checkItem(activeItems,item) ? "active-list-group-item" : ""}>  
                    <ListGroupItemHeading className="list-heading">{item.USER_EMAIL}</ListGroupItemHeading>
                    <ListGroupItemText className="list-body">
                        {desc}
                    </ListGroupItemText>   
                </ListGroupItem > 
                <InputGroupAddon addonType="append">
                    <Button className={(multi) ? 'hide-component' : ''} color="success" id={`ButtonAddEmail-${index}`} value={item} onClick={(e) => {onClickButtonAdd(item)}}> 
                        <FontAwesomeIcon icon={faPlus} />
                    </Button> 
                    <ToolTipCustom componentId={`ButtonAddEmail-${index}`} message={"Add email to list."}/>  
                    <Button className={(!multi) ? 'hide-component' : ''} color="success" 
                        id={`ButtonGroupAddEmail-${index}`} value={item} 
                        active={checkItem(activeItems,item) >= 0}
                        onClick={e => {onClickButtonAddItems(item)}}> 
                        <FontAwesomeIcon icon={checkItem(activeItems,item) ? faCheckCircle : faCircle} />
                    </Button> 
                </InputGroupAddon>
            </InputGroup>
        );
    }) 

    return(
        <ListGroup className="ldap-list-group">
            {ListGroupApp}
        </ListGroup>
    );
}

const ModalEmailSearch = () => { 
    const dispatch = useDispatch();
    const open = useSelector( state => state.TmsReducer.TMSESR.open_email_search );
    const searchValue = useSelector(state => state.TmsReducer.TMSESR.search_value); 
    const id = useSelector(state => state.TmsReducer.TMSESR.id); 
    const multi = useSelector(state => state.TmsReducer.TMSESR.is_multi); 
    const disInput = useSelector(state => state.TmsReducer.TMSESR.disable_search_button);
    const activeItems = useSelector(state => state.TmsReducer.TMSESR.multi_value);
    const [buttonGroupSelected,setButtonGroupSelected] = useState('user_full_name');
    const placeholder = "Enter "+buttonGroupSelected+" here..." 

    const toggle = () => dispatch(setTMSESROpenEmailSearch(!open));    
    
    const onClickAddEmails = (item) => {
        dispatch(addTMSESRUMSEmail(item));  
        dispatch(resetTMSESR());
    }

    const note = (multi) ? "You can select multiple items and will add to the previous selection."
        : "You can only select one. Your current selection will overwrite the previous one";

    return (
        <div> 
            <Modal isOpen={open} toggle={toggle} centered={true}  backdrop={"static"}>
            <ModalHeader>Search TI LDAP</ModalHeader>
            <ModalBody id="ModalBodyEmailSearch">
                <FormGroup className="form-group">   
                    <InputGroup className="top-input"> 
                        <Input value={searchValue} placeholder={placeholder} onChange={(e) => {dispatch(setTMSESRSearchValue(e.target.value))}}/>  
                        <InputGroupAddon addonType="append">
                            <Button color="success" id={"ButtonSearchLDAP"+id} disabled={disInput} onClick={(e) => {dispatch(getTMSESRModal(buttonGroupSelected))}}   >
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                            <ToolTipCustom componentId={"ButtonSearchLDAP"+id} message={"Search LDAP for email."}/> 
                        </InputGroupAddon>
                    </InputGroup>     
                    <ButtonGroup > 
                        <Button color="secondary" className={(buttonGroupSelected === 'user_full_name') ? 'btn-selected' : ''} onClick={ () => setButtonGroupSelected("user_full_name") } active={buttonGroupSelected === 'user_full_name'}>Full Name</Button>
                        <Button color="secondary" className={(buttonGroupSelected === 'user_id') ? 'btn-selected' : ''} onClick={ () => setButtonGroupSelected("user_id") } active={buttonGroupSelected === 'user_id'}>AID/XID</Button>
                        <Button color="secondary" className={(buttonGroupSelected === 'user_email') ? 'btn-selected' : ''} onClick={ () => setButtonGroupSelected("user_email") } active={buttonGroupSelected === 'user_email'}>E-mail</Button>
                    </ButtonGroup>    
                </FormGroup>
                <Alert id="AlertEmailSearchNote" color="primary" className="alert-message-note">
                    {note}
                </Alert> 
                <div id="DivLDAPList" className="email-list-container">
                    <InputGroupAddon addonType="prepend" className="max-w" >Search results</InputGroupAddon> 
                    <div className="email-list"> 
                        <ListTaskGroup/>
                    </div>                    
                </div> 
            </ModalBody>
            <ModalFooter>
                <Button color="success" className={(!multi) ? 'hide-component' : ''} id={"ButtonAddEmail"+id} 
                    onClick={() => {onClickAddEmails(activeItems)}}  disabled={(activeItems.length === 0)} >
                    <FontAwesomeIcon icon={faUserPlus} /> Add User
                </Button>
                <DangerButton icon='close' label='Cancel' className="mr-1 mt-1" onClick={() => dispatch(resetTMSESR())} />
            </ModalFooter>
            </Modal>
        </div>
    );
}

const TMSEmailSearch = ({id,multi,title,stateSelectedName,store,important,disabled}) => {     
    const dispatch = useDispatch();      
    // eslint-disable-next-line
    const [isMulti,setIsMulti] = useState(multi);
    // eslint-disable-next-line
    const [isDisabled,setIsDisabled] = useState(disabled);
    // eslint-disable-next-line
    const [stateSelect,setStateSelect] = useState(stateSelectedName); 
    const options = useSelector(state => state.TmsReducer.TMSESR.ums_select_options);  
    const selectedStore = useSelector(state => state.TmsReducer.TMSESR[store]); 
    const selectedValue = (selectedStore) ? selectedStore[stateSelect] : "";   
    const [openMenu,setOpenMenu] = useState(false);
    var val = '';  
    var placeholder = "Enter an e-mail here...";  
    if(isMulti){
        placeholder = "Enter one or more e-mail here...";
        
        if(selectedValue !== undefined && selectedValue !== '' && selectedValue !== null){
            val = [];
            selectedValue.forEach((item) => {   
                val.push({ value: item.value, label: item.value.USER_EMAIL})
            })  
        }
            
    } else {
        val = (selectedValue) ? {
            value: selectedValue.value,
            label: selectedValue.value.USER_EMAIL
            } : ''; 
    } 

    useEffect( () => {
        setIsDisabled(disabled);
    }, [disabled])

    const openModal = () => {
        dispatch(setTMSESRModalValues({select_key:stateSelect,is_multi:isMulti,id:id,store:store}));
        dispatch(setTMSESROpenEmailSearch(true));
    }

    var h = 35, t = '50%';

    if (multi){
        if(id.includes('AddTask')){
            h = 110;
        } else if (id.includes('AddAction')) {
            h = 60;
        } else {
            h = 91;
        } 
        t = 17;
    }

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

    const onChangeSelect = (e) => {
        var o = {};
        o[stateSelectedName] = e; 
        dispatch(setTMSESRSelectedValue({store:store, key:stateSelectedName ,value:o}))
    }

    return ( 
        
        <InputGroup className="top-input">   
            <ModalEmailSearch/>  
            { important && <TMSRequiredAddOn text={title}/> }       
            { !important && <InputGroupAddon addonType="prepend">{title}</InputGroupAddon> } 
            <Select isMulti={isMulti} maxMenuHeight={200} menuPlacement={"auto"} isLoading={false} placeholder={placeholder} 
                className="react-select-style drop-up" isClearable={true} 
                menuIsOpen={openMenu}
                onFocus={()=>{setOpenMenu(true)}}
                onBlur={()=>{setOpenMenu(false)}}
                options={options} id={id} defaultValue={selectedValue}  
                value={val}
                styles={customStyles}
                onChange={onChangeSelect}
                isDisabled={isDisabled}/>
            <InputGroupAddon addonType="append"> 
                <Button color="success" id={"ButtonShowSearchModal"+id} onClick={openModal} disabled={isDisabled}  >
                    <FontAwesomeIcon icon={faAddressCard} />
                </Button>
                <ToolTipCustom componentId={"ButtonShowSearchModal"+id} message={"Search LDAP for email."}/> 
            </InputGroupAddon>
        </InputGroup>
        
    );
}

export default TMSEmailSearch;