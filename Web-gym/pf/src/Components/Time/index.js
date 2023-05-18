import React, { useState } from 'react';
import PickDateOfTimes  from './Calendar';


const TimeSearch = () => {
    const[isOpen, setIsOpen] = useState(false);
    
    const toggle = () =>{
        setIsOpen(!isOpen);
    };
    
        return (
            <>
                <PickDateOfTimes/>

            </>
        );
};
    

export default TimeSearch
