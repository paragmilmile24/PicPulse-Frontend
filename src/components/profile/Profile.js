import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import userDummyImage from '../../assets/user.png'

function Profile() {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.postsReducer.userProfile);
    const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const feedData = useSelector((state) => state.feedDataReducer.feedData);

    useEffect(() => {
        console.log("Updating profile page");
        console.log("User Id : ", params.userId);

        dispatch(
            getUserProfile({
                userId: params.userId,
            })
        );

        setIsMyProfile(myProfile?._id === params.userId);
        if (feedData?.followings?.find((item) => item._id === params.userId)) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }
    }, [myProfile, params.userId,feedData]);

    function handleFollowUnfollow() {
        dispatch(
            followAndUnfollowUser({
                userIdToFollow: params.userId,
            })
        );
    }

    return (
        <div className="Profile">
            <div className="container">
                <div className="left-part">
                    {isMyProfile && <CreatePost />}
                    {userProfile?.posts?.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
                <div className="right-part">
                    <div className="profile-card">
                        <img
                            className="user-img"
                            src={userProfile?.avatar?.url || userDummyImage}
                            alt="User-img"
                        />
                        <h3 className="user-name">{userProfile?.name}</h3>
                        <p className="bio">{userProfile?.bio}</p>
                        <div className="follower-info">
                            <h4>{`${userProfile?.followers?.length} Followers`}</h4>
                            <h4>{`${userProfile?.followings?.length} Followings`}</h4>
                        </div>
                        {!isMyProfile && (
                            <h5
                                onClick={handleFollowUnfollow}
                                className={
                                    isFollowing
                                        ? "hover-link follow-link follow"
                                        : "btn-primary follow"
                                }
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </h5>
                        )}
                        {isMyProfile && (
                            <button
                                className="follow btn-secondary"
                                onClick={() => navigate("/updateProfile")}
                            >
                                Update Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
