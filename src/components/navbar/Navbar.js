import React from "react";
import Avatar from "../avatar/Avatar";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

    async function handleLogoutClicked() {
        try {
            dispatch(setLoading(true));
            await axiosClient.post("/auth/logout");
            removeItem(KEY_ACCESS_TOKEN);
            navigate("/login");
            dispatch(setLoading(false));
        } catch (error) {}
    }
    return (
        <div className="Navbar">
            <div className="container">
                <h2
                    className="left-side hover-link"
                    onClick={() => navigate("/")}
                >
                    PicPulse
                </h2>
                <div className="right-side">
                    <div
                        className="profile hover-link"
                        onClick={() => navigate(`/profile/${myProfile._id}`)}
                    >
                        <Avatar src={myProfile?.avatar?.url} />
                    </div>

                    <div
                        className="logout hover-link"
                        onClick={handleLogoutClicked}
                    >
                        <IoIosLogOut />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
