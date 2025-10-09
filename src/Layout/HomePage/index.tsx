import { Outlet, useNavigate } from "react-router-dom";
import { barConfig } from "@/config";
import './index.less'
import { IConfig } from "@/types";
// import { Watermark } from 'antd';


export default function HomePage() {
    const navigate = useNavigate();
    // 共享状态 
    const goto = (row: IConfig) => {
        if (row.type === 'push') {
            navigate(row.path);
        } else {
            window.open(row.path, '_blank');
        }
    }

    return (
        <div className="home-container">
            {/* 个人介绍部分 */}
            <header className="header">
                <nav>
                    {
                        barConfig.map((item, index) => {
                            if (item.isIcon) {
                                return <span
                                    key={index}
                                    className="nav-item"
                                    onClick={() => goto(item)}
                                >
                                    {item.icon}
                                </span>
                            } else {
                                return <span
                                    key={index}
                                    className="nav-item"
                                    onClick={() => goto(item)}
                                >
                                    {item.label}
                                </span>
                            }

                        })
                    }
                </nav>
            </header>
            <Outlet />
        </div>
    )
}