import React from "react";
import { useRoutes, Navigate, RouteObject } from "react-router-dom";
import Home from "@/pages/home";
import Vitae from "@/pages/vitae";
import HomePage from "@/Layout/HomePage";
import Note from "@/pages/note";
import NoteHome from "@/pages/note/note-home";
import Login from "@/pages/login";
import Demo from "@/pages/demo";

// 路由懒加载
const AddNote = React.lazy(() => import("@/pages/note/add-note"));
const Chat = React.lazy(() => import("@/pages/chat"));

const rootRouter: RouteObject[] = [
    {
        path: "/",
        element: <HomePage />,
        children: [
            {
                index: true,
                element: <Navigate to="/home" />
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/note",
                element: <Note />,
                children: [
                    {
                        path: "/note",
                        element: <NoteHome />,
                    },
                    {
                        path: "/note/addNote",
                        element: <AddNote />,
                    },
                ]
            },
            {
                path: "/demo",
                element: <Demo />,
            },
            {
                path: "/curriculumVitae",
                element: <Vitae />,
            },
        ],
    },
    // 聊天路由 需要登陆
    {
        path: "/chat",
        element: <Chat />,
    },
    {
        path: "/login",
        element: <Login />,
    },
];

const Router = () => {
    const routes = useRoutes(rootRouter);
    return routes;
};

export default Router;
