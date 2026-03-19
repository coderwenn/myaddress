import { useState } from "react";

export default function useData() {

    const [value, setValue] = useState('')

    const [funs,setFuns] = useState({
        setFormValue:()=>{},
        getFormValue:()=>{}
    })

    return {
        value,
        setValue,
        funs,
        setFuns
    }
}
