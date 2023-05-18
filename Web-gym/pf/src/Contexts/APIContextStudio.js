import {createContext, useState} from "react";

export const useAPIContext = () => {
    const [ studios, setStudios ] = useState([]);
    return {
        studios,
        setStudios,
    }
}

const APIContextStudio = createContext({
    studios: null, setStudios: () => {},
})

export default APIContextStudio;