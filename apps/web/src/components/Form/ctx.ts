import React, { createContext } from 'react'

interface FormContextType {
    name: string;
}

export const FormContext = createContext<React.Context<FormContextType>>({} as React.Context<FormContextType>)