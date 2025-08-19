import React, { useContext } from 'react'
import { FormContext } from './ctx'

type FormProps = {
    children: React.ReactNode
}

const FormItem = <T,>(props: T & {children: React.ReactNode })=>{
    const {children = <></>} = props
    return <>
        {children}
    </>
}
console.log(FormItem)

const Form: React.FC<FormProps> = (props) => {
    const FormContextFun = useContext(FormContext)
    const { children = <></> } = props

    return (
        <FormContextFun.Provider value={{ name: 'form' }}>
            <div>Form</div>
            {children}
        </FormContextFun.Provider>
    )
}

export default Form
