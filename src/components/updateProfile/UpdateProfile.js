import React, { useEffect, useState } from "react";
import userDummyImg from "../../assets/user.png";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, showToast, updateMyProfile } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";
import { TOAST_SUCCESS } from "../../App";

function UpdateProfile() {
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [userImg, setUserImg] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setName(myProfile?.name || "");
        setBio(myProfile?.bio || "");
        setUserImg(myProfile?.avatar?.url);
    }, [myProfile]);

    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();

        //Encode file into base64
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setUserImg(fileReader.result);
                console.log("Base 64 encoded image data : ", fileReader.result);
            }
        };
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(
            updateMyProfile({
                name,
                bio,
                userImg,
            })
        );
    }

    async function handleDeleteProfile(e) {
        try {
            dispatch(setLoading(true));
            // const response = await axiosClient.delete("/user/");
            await axiosClient.delete("/user/");
            removeItem(KEY_ACCESS_TOKEN);
            navigate("/login");
            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "User account deleted",
                })
            );
            dispatch(setLoading(false));
        } catch (e) {
            console.log("Error in deleting User", e);
        }
    }

    return (
        <div className="UpdateProfile">
            <div className="container">
                <div className="left-part">
                    {/* <img className="user-img" src={userImg} alt="User Image" /> */}
                    <div className="input-user-img">
                        <label htmlFor="inputImg" className="labelImg">
                            <img
                                src={userImg ? userImg : userDummyImg}
                                alt="User"
                            />
                        </label>
                        <input
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            className="inputImg"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className="right-part">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={name}
                            placeholder="Your name please"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            value={bio}
                            placeholder="Your bio please"
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <input
                            type="submit"
                            className="btn-primary"
                            onClick={handleSubmit}
                        />
                    </form>

                    <button
                        className="delete-account btn-primary"
                        onClick={handleDeleteProfile}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile;
