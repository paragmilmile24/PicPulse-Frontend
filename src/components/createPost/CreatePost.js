import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./CreatePost.scss";
// import backgroundImg from "../../assets/post.jpg";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postsSlice";

function CreatePost() {
    const [postImg, setPostImg] = useState("");
    const [caption, setCaption] = useState("");
    const dispatch = useDispatch();
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    function handleImageChange(e) {
        const file = e.target.files[0];
        const fileReader = new FileReader();

        //Encode file into base64
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setPostImg(fileReader.result);
                // console.log("Base 64 encoded imgae data : ", fileReader.result);
            }
        };
    }

    async function handlePostSubmit(e) {
        try {
            dispatch(setLoading(true));
            const result = await axiosClient.post("/posts", {
                caption,
                postImg,
            });
            console.log("Post done", result);
            dispatch(
                getUserProfile({
                    userId: myProfile?._id,
                })
            );
        } catch (e) {
        } finally {
            dispatch(setLoading(false));
            setCaption("");
            setPostImg("");
        }
    }

    return (
        <div className="CreatePost">
            <div className="create-post-left-part">
                <Avatar src={myProfile?.avatar?.url} />
            </div>
            <div className="create-post-right-part">
                <input
                    type="text"
                    value={caption}
                    placeholder="Put your thoughts here"
                    className="captionInput"
                    onChange={(e) => setCaption(e.target.value)}
                />
                {postImg && (
                    <div className="img-container">
                        <img
                            className="post-img"
                            src={postImg}
                            alt="Post-Img"
                        />
                    </div>
                )}
                <div className="bottom-part">
                    <div className="input-post-img">
                        <label htmlFor="inputImg" className="labelImg">
                            <BsCardImage />
                        </label>
                        <input
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            className="inputImg"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button
                        className="post-btn btn-primary"
                        onClick={handlePostSubmit}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
