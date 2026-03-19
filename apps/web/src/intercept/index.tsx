import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const isLogIn = ['/curriculumVitae', '/note', '/chat']
const Intercept: FC<{
    children: React.ReactNode;
}> = (props) => {
    const { children } = props;

    // 获取路由信息
    const navigate = useNavigate();
    const location = useLocation();

    // 符合条件的页面，需要登录
    async function needLogin() {
        if (isLogIn.includes(location.pathname)) {
            // 检测是否有cookie
            if ('cookieStore' in self) {
                const cookies = await cookieStore.getAll();
                console.log('cookies', cookies)
                // 检测是否有 AICHAT_TOKEN
                if (cookies.find(item => item.name === 'AICHAT')) {
                    return true
                } else {
                    navigate('/login')
                }

            } else {
                console.log(document.cookie)

            }
        }
    }

    useEffect(() => {
        needLogin()
    }, [navigate, location])

    return (
        children
    );
}

export default Intercept