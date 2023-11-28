import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';
import NavBar from "./components/NavBar";
import routes from "./routes";
import Toast from "./components/Toast";
import useToast from "./hooks/toast";
import {useDispatch, useSelector} from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import {useEffect, useState} from "react";
import {login} from "./store/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    const toasts = useSelector(state => state.toast.toasts)
    const {deleteToast} = useToast();
    const [loading, setLoading] = useState(true); // isLoggedIn 위해 만들었는데
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn')){ // 로컬스토리지 로그인 되었다는거 있다면
            dispatch(login());
        }
        setLoading(false); // 이부분을 렌더링을 아예 안시켜 버리는거죠. 로딩이 아직 안되었을 때
    }, []);

    if (loading){
        return <LoadingSpinner/>
    }

    return (
        <Router>
            <NavBar/>
            <Toast
                toasts={toasts}
                deleteToast={deleteToast}
            />
            <div className="container mt-3">
                <Routes>
                    {routes.map((route) => {// auth가 있어서 인증이 필요한 경우 ProtectedRoute.jsx로
                        return <Route
                            key={route.path}
                            path={route.path}
                            element={route.auth ? <ProtectedRoute
                                element={route.element}
                            /> : route.element}
                        />
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;