// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux'; 
// import { Button, InputGroup, InputGroupAddon, Input,
//     ModalHeader, Modal, ModalBody, ModalFooter} from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSave, faDoorOpen } from '@fortawesome/free-solid-svg-icons'; 
   
// import IconRequired from '../resources/images/required.svg';

// import { 
//     setTMSPPIAARShortageInfo,
//     setTMSPPIAARShowModal,
//     mergeTMSPPIAARShortageComment
//     } from '../actions/TMSActions'; 

// const TMSPPIAddAction = () => {      
//     var maxLength = 1000;
//     const dispatch = useDispatch(); 
//     const [charCount,setCharCount] = useState(maxLength);
//     const [textAreaComment,setTextAreaComment] = useState('');
    
//     var shortageInfo = {...useSelector( state => state.TmsReducer.TMSPPIAAR.shortage_info )};
//     var toggle = useSelector( state => state.TmsReducer.TMSPPIAAR.toggle );  
  
//     useEffect(() => {    
//         dispatch(setTMSPPIAARShortageInfo()); // this should be set on the button on the grid comment this out once done
//     },[toggle])
 

//     const onChangeTextAreaComment = (e) => {
//         var count = (e.target.value === null) ? 0 : e.target.value.length;
//         setCharCount(maxLength - count);
//         setTextAreaComment(e.target.value);
//     }

//     const onClickButtonClose = (e) => {
//         dispatch(setTMSPPIAARShowModal(false));
//     }

//     const onClickButtonAddComment = (e) => {
//         dispatch(mergeTMSPPIAARShortageComment(textAreaComment));
//         setTextAreaComment('');
//     }

//     return ( 
//         <Modal isOpen={toggle} centered={true} id="ModalTMSPPIAddAction" backdrop={"static"}>
//             <ModalHeader>Add New Comment</ModalHeader>
//             <ModalBody id="ModalBodyCreateTaskGroup">
//                 <div className="tms-ppi-flex-column" id="DivTMSPPIAddAction">   
//                     <div className="tms-ppi-flex-column"> 
//                         <div className="tms-ppi-flex-row">
//                             <InputGroup className="tms-ppi-flex-no-wrap">
//                                 <InputGroupAddon addonType="prepend">
//                                     Region
//                                 </InputGroupAddon>
//                                 <Input value={shortageInfo.region} disabled={true} className={"tms-ppi-input-label"}/> 
//                             </InputGroup> 
//                             <InputGroup className="tms-ppi-flex-no-wrap">
//                                 <InputGroupAddon addonType="prepend">
//                                     Subcon
//                                 </InputGroupAddon>
//                                 <Input value={shortageInfo.subcon} disabled={true} className={"tms-ppi-input-label"}/> 
//                             </InputGroup>
//                         </div> 
//                         <div className="tms-ppi-flex-row">
//                             <InputGroup className="tms-ppi-flex-no-wrap">
//                                 <InputGroupAddon addonType="prepend">
//                                     As of date
//                                 </InputGroupAddon>
//                                 <Input value={shortageInfo.as_of_date} disabled={true} className={"tms-ppi-input-label"}/> 
//                             </InputGroup>
                            
//                             <InputGroup className="tms-ppi-flex-no-wrap">
//                                 <InputGroupAddon addonType="prepend">
//                                     Material
//                                 </InputGroupAddon>
//                                 <Input value={shortageInfo.material} disabled={true} className={"tms-ppi-input-label"}/> 
//                             </InputGroup>
//                         </div>
//                         <InputGroup className="tms-ppi-flex-no-wrap tms-ppi-bottom-padding">
//                             <InputGroupAddon addonType="prepend">
//                                 ATSS Id
//                             </InputGroupAddon>
//                             <Input value={shortageInfo.atss_id} disabled={true} className={"tms-ppi-input-label"}/> 
//                         </InputGroup>
//                     </div> 
//                     <InputGroup>
//                         <InputGroupAddon addonType="prepend" className="input-group-text">
//                             <img src={IconRequired} className="icon-required" alt=""/>{`Shortage Comment\n(${charCount} left) `}
//                         </InputGroupAddon> 
//                         <Input id="InputActionComment" type="textarea" maxLength={maxLength} placeholder="Enter the shortage comment..."
//                              value={textAreaComment}
//                              onChange={onChangeTextAreaComment}/>  
//                     </InputGroup> 
//                 </div>
//             </ModalBody>
//             <ModalFooter id="ModalFooterTMSPPIAddAction"> 
//                 <Button color="primary" size="sm" className="main-buttons" 
//                     disabled={textAreaComment === null || textAreaComment.length === 0}
//                     onClick={onClickButtonAddComment}>
//                     <FontAwesomeIcon icon={faSave} className="main-button-icon" />Add
//                 </Button>
//                 {' '}
//                 <Button color="danger" size="sm" className="main-buttons" 
//                     onClick={onClickButtonClose}>
//                     <FontAwesomeIcon icon={faDoorOpen} className="main-button-icon" />Close
//                 </Button>
//             </ModalFooter>
//         </Modal>
        
//     );
// }

// export default TMSPPIAddAction;