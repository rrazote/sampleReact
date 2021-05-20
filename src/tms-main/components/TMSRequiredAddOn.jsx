import React from 'react';
import { InputGroupAddon } from 'reactstrap';
import IconRequired from '../resources/images/required.svg';

const TMSRequiredAddOn = ({text}) => {
    return(
        <InputGroupAddon addonType="prepend" className="input-group-text">
            <img src={IconRequired} className="icon-required" alt=""/>{text}
        </InputGroupAddon>
    );
}

export default TMSRequiredAddOn;