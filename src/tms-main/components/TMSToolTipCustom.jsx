import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const ToolTipCustom = ({componentId,message,placement,open}) => {  
    if(typeof placement == 'undefined'){
        placement= "right"
    }
    if(typeof open == 'undefined'){
        open = false;
    }
    const [tooltipOpen, setTooltipOpen] = useState(open); 
    const toggle = () => setTooltipOpen(!tooltipOpen);     
    return(
        <Tooltip placement={placement} isOpen={tooltipOpen} target={componentId} toggle={toggle} >
            {message}
        </Tooltip> 
    );    
} 

export default ToolTipCustom;