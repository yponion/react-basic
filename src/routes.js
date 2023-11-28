import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ShowPage from "./components/ShowPage";

const routes = [
    {
        path: '/',
        element: <HomePage/>
    },
    {
        path: '/blogs',
        element: <ListPage/>
    },
    {
        path: '/admin',
        element: <AdminPage/>,
        auth: true // 인증 true 추가
    },
    {
        path: '/blogs/create',
        element: <CreatePage/>,
        auth: true
    },
    {
        path: '/blogs/:id/edit',
        element: <EditPage/>,
        auth: true
    },
    {
        path: '/blogs/:id',
        element: <ShowPage/>
    },
    {
        path: '*',
        element: <NotFoundPage/>
    },
];

export default routes;