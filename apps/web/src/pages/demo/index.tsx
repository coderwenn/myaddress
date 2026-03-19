import { useContext } from 'react'

import { Button } from 'antd';
import { LayoutContext } from '@/App';
import { NumberKeyboard } from 'react-vant';
import styles from './index.module.less'

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
    // <>123123</>
    <div className={styles['number-keyboard']}>
      <NumberKeyboard
        theme='custom'
        extraKey={['00', '.']}
        closeButtonText='完成'
        visible={true}
        onBlur={() => { }}
      />
    </div>

  )
}

export default Demo