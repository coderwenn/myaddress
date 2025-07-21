import React from "react";
import { useRoutes, Navigate, RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Vitae from "@/pages/Vitae";
import HomePage from "@/Layout/HomePage";
import Note from "@/pages/Note";
import NoteHome from "@/pages/Note/NoteHome";
import Login from "@/pages/Login";

// 路由懒加载
const AddNote = React.lazy(() => import("@/pages/Note/AddNote"));
const Chat = React.lazy(() => import("@/pages/Chat"));


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
                path: "/curriculumVitae",
                element: <Vitae />,
            },
            {
                path: "/chat",
                element: <Chat />,
            },

        ],
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
