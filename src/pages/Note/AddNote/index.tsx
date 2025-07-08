import React, { useEffect, useRef } from "react";

import styles from './index.module.less'

const AddNote: React.FC = () => {

    const yuqueRef = useRef(null)


    const createYuque = () => {

    }


    useEffect(() => {
        createYuque()
    }, [])


    return (
        <div className={styles.addNote} ref={yuqueRef} >
            AddNote
        </div>
    )
}

export default AddNote