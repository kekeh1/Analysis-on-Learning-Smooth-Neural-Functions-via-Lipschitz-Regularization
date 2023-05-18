import {createContext, useState} from "react";

export const useAPIContext = () => {
    const [ classes, setClasses ] = useState([]);
    return {
        classes,
        setClasses,
    }
}

const APIContextc = createContext({
    studios: null, setClasses: () => {},
})

export default APIContextc;