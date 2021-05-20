import React, { useState, useEffect, useRef } from 'react'; 

import '../resources/css/tms-ui.css';
import Success from '../resources/images/success.svg';
import Error from '../resources/images/error.svg';
import Warning from '../resources/images/warning.svg'; 


const Toast = ({toggle,opts}) => {  
    // opts = type,title,message,position,close_time
    const isFirstRun = useRef(true); 
    const [open,setOpen] = useState(false); 

    var styleOpts = {
        success: { 
            style: {
                backgroundColor: 'rgb(0 158 0)'
            },
            image: Success
        },
        error: {
            style: {
                backgroundColor: 'rgb(255 0 0)'
            },
            image: Error
        },
        warning: {
            style: {
                backgroundColor: '#ffc107'
            },
            image: Warning
        }
    }
    
    useEffect(() => { 
        if(isFirstRun.current){
            isFirstRun.current = false;
        } else { 
            setOpen(true); 
            setTimeout(() => {                    
                setOpen(false);      
            },opts.close_time) ;
        }         
        // eslint-disable-next-line
    },[toggle]) 

    return ( 
        <div className={`notification-container ${opts.position}`}>
            { open && <div className={`notification ${opts.position}`} style={styleOpts[opts.type].style}> 
                <div className="notification-image">
                    <img src={styleOpts[opts.type].image} alt="" />
                </div>
                <div>
                    <p className="notification-title">{opts.title}</p>
                    <p className="notification-message">{opts.message}</p>
                </div>
            </div>   
            }             
        </div> 
    );
} 
export default Toast;