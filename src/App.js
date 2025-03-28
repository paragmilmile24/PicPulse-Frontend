import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import RequireUser from "./components/RequireUser";
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import LoadingBar from "react-top-loading-bar";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import NotLoggedInUser from "./components/NotLoggedInUser";
import toast, { Toaster } from "react-hot-toast";
import NotFound from "./components/notfound/NotFound";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";
function App() {
    const isLoading = useSelector((state) => state.appConfigReducer.isLoading);
    const toastData = useSelector((state) => state.appConfigReducer.toastData);
    const loadingRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            loadingRef.current?.continuousStart(); //continuous start will work only if not null
        } else {
            loadingRef.current?.complete();
        }
    }, [isLoading]);

    useEffect(() => {
        switch (toastData.type) {
            case TOAST_SUCCESS:
                toast.success(toastData.message);
                break;

            case TOAST_FAILURE:
                toast.error(toastData.message);
                break;
        }
    }, [toastData]);
    return (
        <div className="App">
            <LoadingBar
                height={2}
                color="#f11946"
                ref={loadingRef}
                shadow={true}
            />
            <div>
                <Toaster />
            </div>
            <Routes>
                <Route element={<RequireUser />}>
                    <Route element={<Home />}>
                        <Route path="/" element={<Feed />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                        <Route
                            path="/updateProfile"
                            element={<UpdateProfile />}
                        />
                    </Route>
                </Route>
                <Route element={<NotLoggedInUser />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
