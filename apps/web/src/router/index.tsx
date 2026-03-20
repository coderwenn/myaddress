import React from "react";
import { useRoutes, Navigate, RouteObject } from "react-router-dom";
import Login from "@/pages/login";

// 路由懒加载
const Chat = React.lazy(() => import("@/pages/chat"));

const rootRouter: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/chat" />
    },
    // 聊天路由
    {
        path: "/chat",
        element: <Chat />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <Navigate to="/chat" />,
    },
];

const Router = () => {
    const routes = useRoutes(rootRouter);
    return routes;
};

export default Router;
