import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import ShowPage from "./components/ShowPage";
import AdminPage from "./pages/AdminPage";

const routes = [
    {
        path: '/',
        component: HomePage
    },
    {
        path: '/blogs',
        component: ListPage
    },
    {
        path: '/admin',
        component: AdminPage
    },
    {
        path: '/blogs/create',
        component: CreatePage
    },
    {
        path: '/blogs/:id/edit',
        component: EditPage
    },
    {
        path: '/blogs/:id',
        component: ShowPage
    },
];

export default routes;