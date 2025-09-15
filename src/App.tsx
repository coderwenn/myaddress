import './App.less'
import { HashRouter } from 'react-router-dom'
import Router from './router'
import useData from "@/hooks/useData";
import React from 'react';

import './index.css'

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-explicit-any
export const LayoutContext = React.createContext<any>({})


function App() {
  const data = useData();
  return (
    <LayoutContext.Provider value={{ ...data }}>
        <HashRouter>
          <Router />
        </HashRouter>
    </LayoutContext.Provider>
  )
}

export default App
