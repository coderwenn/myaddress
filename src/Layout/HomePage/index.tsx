import { Outlet, useNavigate } from "react-router-dom";
import { barConfig } from "@/config";
import './index.less'

export default function HomePage() {
    const navigate = useNavigate();
    
    const goto = (path: string)=>{
        navigate(path);
    }




    return <div className="home-container">
        {/* 个人介绍部分 */}
        <header className="header">
            <nav>
                {
                    barConfig.map((item, index) => {
                        return <span
                            key={index}
                            className="nav-item"
                            onClick={() => goto(item.key)}
                        >
                            {item.label}
                        </span>
                    })
                }
            </nav>
        </header>
        <>
            <Outlet />
        </>
    </div>
}