import React from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
// import postImg from "../../assets/post.jpg";
import { LuHeart } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router";

function Post({ post }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function handlePostLiked() {
        dispatch(
            likeAndUnlikePost({
                postId: post._id,
            })
        );
    }
    return (
        <div className="Post">
            <div
                className="heading"
                onClick={() => navigate(`/profile/${post.owner._id}`)}
            >
                {/* No using question mark before owner beacuse it is gauranteed that post will have a owner */}
                <Avatar src={post.owner?.avatar?.url} />
                <h4>{post?.owner?.name}</h4>
            </div>
            <div className="content">
                <img src={post.image?.url} alt="" />
            </div>
            <div className="footer">
                <div className="like" onClick={handlePostLiked}>
                    {post.isLiked ? (
                        <LuHeart
                            style={{ fill: "red", color: "red" }}
                            className="icon"
                        />
                    ) : (
                        <LuHeart className="icon" />
                    )}
                    {/* <LuHeart className="icon" /> */}
                    <h4>{`${post.likesCount} likes`}</h4>
                </div>
                <p className="caption">{post.caption}</p>
                <h6 className="time-ago">{post?.timeAgo}</h6>
            </div>
        </div>
    );
}

export default Post;
