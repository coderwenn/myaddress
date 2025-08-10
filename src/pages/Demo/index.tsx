import { useContext } from 'react'

import { Button } from 'antd';
import { LayoutContext } from '@/App';

function Demo() {
  const { value, funs } = useContext(LayoutContext);

  if (value) {
    return <div>
      <Button
        onClick={() => {
          funs.setFormValue({
            username: 'coder',
            password: '123456',
          })
        }}
      >设置表单值</Button>
      <Button
        onClick={() => {
          const formValue = funs.getFormValue();
          console.log(formValue);
        }}
      >获取表单值</Button>
    </div>
  }

  return (
    <>123123</>
  )
}

export default Demo