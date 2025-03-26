import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";
import { likeAndUnlikePost } from "./postsSlice";

export const getFeedData = createAsyncThunk(
    "/user/getFeedData",
    async (_, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading(true));
            const response = await axiosClient.get("/user/getFeedData");
            console.log("User Feed Data ", response);
            return response.result;
        } catch (error) {
            return Promise.reject(error);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

export const followAndUnfollowUser = createAsyncThunk(
    "user/followAndUnfollowUser",
    async (body, thunkAPI) => {
        try {
            thunkAPI.dispatch(setLoading(true));
            const response = await axiosClient.post("/user/follow", body);
            console.log("Follow Unfollows Data ", response);
            return response.result.user;
        } catch (error) {
            return Promise.reject(error);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

const feedSlice = createSlice({
    name: "feedSlice",
    initialState: {
        feedData: {},
    },
    extraReducers: (builders) => {
        builders
            .addCase(getFeedData.fulfilled, (state, action) => {
                state.feedData = action.payload;
            })
            .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
                const post = action.payload;
                const index = state?.feedData?.posts?.findIndex(
                    (item) => item._id == post._id
                );

                if (index != undefined && index != -1) {
                    state.feedData.posts[index] = post;
                }
            })
            .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
                const user = action.payload;

                const index = state?.feedData?.followings?.findIndex(
                    (item) => item._id == user._id
                );

                if (index != undefined && index != -1) {
                    state?.feedData?.followings.splice(index, 1);
                    state?.feedData?.suggestions.push(user);
                } else {
                    state?.feedData?.followings?.push(user);
                    const suggIndex = state?.feedData?.suggestions?.findIndex(
                        (item) => item._id == user._id
                    );
                    state?.feedData?.suggestions?.splice(suggIndex, 1);
                }
            });
    },
});

export default feedSlice.reducer;
