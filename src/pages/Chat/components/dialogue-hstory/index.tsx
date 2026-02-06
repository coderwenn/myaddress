import React, { memo, useCallback, useState } from 'react'
import { conversationListType } from '../../type';

interface Iprops {
  callBack: (id: number) => void
  conversationList: {
    list: Array<conversationListType>
    total: number
  }
}


const DialogueHistory: React.FC<Iprops> = ({ callBack, conversationList }) => {
  console.log('conversationList', conversationList)
  return (
    <div>
      {conversationList?.list?.map(item => (
        <div
          className='w-[100%] h-[40px] flex items-center justify-center hover:bg-[#f5f5f5] p-[8px] cursor-pointer'
          key={item?.id} onClick={() => callBack(item?.id)}>
          {item?.title}
        </div>
      ))}
    </div>
  )
}

export default memo(DialogueHistory)