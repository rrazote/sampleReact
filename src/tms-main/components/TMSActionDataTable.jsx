import React, { useEffect, useState, useRef } from 'react'; 
import ReactiveDataTable from 'reactive-tables';
import { useSelector, useDispatch } from 'react-redux'; 
import { 
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    InputGroup, ListGroupItem, ListGroupItemHeading, InputGroupAddon, ListGroup
    } from 'reactstrap'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faListAlt, faSave, faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 

import ToolTipCustom from './TMSToolTipCustom.jsx'  
import IconDownload from '../resources/images/download.svg';
import { 
    setTMSAARSetActionData,
    mergeTMSAARMergeAction,
    setTMSADTRDialogDelete,
    setTMSADTRFileList,
    downloadFile
    } from '../actions/TMSActions'; 

const ListFiles = ({list}) => { 
    const dispatch = useDispatch();
    let Task = list.map((item,index) => {
        const onClickDownloadFile = () => {
            dispatch(downloadFile(item.FILE_LOCATION,item.FILE_NAME));
        }
        return (
            <InputGroup className="flex-no-wrap" key={`add-task-list-${index}`}>
                <ListGroupItem > 
                    <ListGroupItemHeading className="list-heading">{item.FILE_NAME}</ListGroupItemHeading> 
                </ListGroupItem > 
                <InputGroupAddon addonType="append">
                    <Button color="secondary" id={`ButtonDownloadFile-${index}`} 
                        onClick={onClickDownloadFile}>
                        <img id={`IconDownload-${index}`} src={IconDownload} className="button-icon" alt=""/> 
                        <ToolTipCustom componentId={`ButtonDownloadFile-${index}`} message={"Download file."}/>
                    </Button>
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

const ModalFileList = () => {  
    var opts = useSelector( state => state.TmsReducer.TMSADTR.action_show_file_list);  
    const [open, setOpen] = useState(false);
    const isFirstRun = useRef(true); 
    useEffect(()=>{
        if(isFirstRun.current){
            isFirstRun.current = false;
        } else { 
            setOpen(true)
        }
    },[opts.toggle]) 

    return(
        <React.Fragment>
            <Modal isOpen={open} centered={true} backdrop={"static"}>
            <ModalHeader>Files for download</ModalHeader>
            <ModalBody className="style-column" id="ModalBodyFileList">
                <div id="DivFileList">
                    <ListFiles list={opts.file_list}/>
                </div>
            </ModalBody>
            <ModalFooter>  
                <Button color="danger" onClick={()=>{setOpen(false)}}>
                    <FontAwesomeIcon icon={faDoorOpen} /> Close
                </Button> 
            </ModalFooter>
            </Modal>
        </React.Fragment>
    );
}


const ModalDeleteConfirmation = () => { 
    const dispatch = useDispatch();
    var opts = useSelector( state => state.TmsReducer.TMSADTR.action_dialog_delete); 
    const [open, setOpen] = useState(false);
    const isFirstRun = useRef(true); 
    useEffect(()=>{
        if(isFirstRun.current){
            isFirstRun.current = false;
        } else { 
            setOpen(true)
        }
    },[opts.toggle])

    const onClickButtonProceed = () => {     
        dispatch(setTMSAARSetActionData({merge_type: 'DELETE'}))
        dispatch(mergeTMSAARMergeAction([],opts.action_id)); 
        setOpen(false);
    }

    return(
        <React.Fragment>
            <Modal isOpen={open} centered={true} backdrop={"static"}>
            <ModalHeader>Confirm</ModalHeader>
            <ModalBody className="style-column" id="ModalBodyAddStatus">
                 You are deleting an action to a specific task instance.
                 Attached files will also be deleted.
                 This is permanent and cannot be undone.
                 Are you sure?
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


const CustomRows = ({data, columns}) => { 
    const dispatch = useDispatch();
    var toggle = useSelector( state => state.TmsReducer.TMSADTR.action_dialog_delete.toggle); 
    const onClickButtonDelete = () => {
        dispatch(setTMSADTRDialogDelete({action_id: data.ACTION_ID,toggle: !toggle}));
    }
    const onClickButtonShowDownloads = () => {
        dispatch(setTMSADTRFileList(data.ACTION_ID));
    }
    const record = data;
    const cells = columns.map((column) => {
        let key = 'column-' + column.key;
        if ( column.key === 'action'){ 
            return <td key={key} id={`tdActionId-${data.ROW_ID}`} >  
                <div className="style-row"> 
                    <div> 
                        <Button id={`TmsDeleteButton-${data.ROW_ID}`} color="danger" size="sm" className="tms-buttons-table"
                            onClick={onClickButtonDelete}>
                            <FontAwesomeIcon icon={faMinus}  id={`TmsTmsDeleteButtonIcon-${data.ROW_ID}`}/> 
                            <ToolTipCustom componentId={`TmsDeleteButton-${data.ROW_ID}`} message={`Remove this action to this task.`} placement={"top"}/>
                        </Button>                              
                        {'  '}
                        <Button id={`TmsShowUploads-${data.ROW_ID}`} color="secondary" size="sm" className="tms-buttons-table" 
                            disabled={(data.FILE_NAME === null)}
                            onClick={onClickButtonShowDownloads}>
                            <FontAwesomeIcon icon={faListAlt}  id={`TmsShowUploadsIcon-${data.ROW_ID}`}/> 
                            <ToolTipCustom componentId={`TmsShowUploads-${data.ROW_ID}`} message={`View uploaded files of this task.`} placement={"top"}/>
                        </Button>          
                        
                    </div>  
                </div>
            </td>
        } else if (column.key === 'ACTION_DTTM') {
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
        }else {
            return <td key={key} >{record[column.key]}</td>
        }
        
    });
    return (
        <tr>{cells}</tr> 
    );
}

const TMSActionDataTable = () => {
    const [results, setResults] = useState([]);
    const [stopEffect,setStopEffect] = useState(0);
    const [isLoading, setIsLoading] = useState(true); 
    const [columnHeaders, setColumnHeaders] = useState([]); 
    const selectedRow = useSelector(state => state.TmsReducer.TMSTDTR.selected_row); 
    const dbRes = [...useSelector(state => state.TmsReducer.TMSADTR.action_filtered)];
    const columns = useSelector(state => state.TmsReducer.TMSADTR.action_columns); 

    useEffect(() => {         
        setColumnHeaders(columns);
        setResults(dbRes);
        setIsLoading(dbRes.length === 0 && selectedRow.DATA_CNT > 0);
        setStopEffect(1); 
        var d = document.querySelector('.tmsactiontable');
        // remove the upper pagination of the reactive table
        d.querySelector('.float-right').style.display = "none";
        // remove the bottom setting buttons
        var d1 = d.querySelectorAll('.navBar')[1];
        d1.querySelector('.mr-1.mb-1').style.display = "none";  
        // eslint-disable-next-line
    },[stopEffect,selectedRow,dbRes.length]);   
 
    return (
        <React.Fragment>
            <ModalFileList/>
            <ModalDeleteConfirmation/>
            <ReactiveDataTable 
                className={"tmsactiontable"}
                showSpinner={isLoading}
                columns={columnHeaders}
                data={results}
                striped
                columnFilters
                disableDownload={true}
                row={CustomRows}
                size={100}
                actionColumns={["action"]} /> 
        </React.Fragment>
    );
}

export default TMSActionDataTable;