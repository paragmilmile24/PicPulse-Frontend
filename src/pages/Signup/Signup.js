import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.scss";
import { axiosClient } from "../../utils/axiosClient";
// import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";
import { useDispatch } from "react-redux";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await axiosClient.post("/auth/signup", {
                name,
                email,
                password,
            });

            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "User created. Please login",
                })
            );
            e.target.reset();
            // console.log("Response on signup : ", response);
        } catch (error) {
            console.log(e);
        }
    }

    return (
        <div className="Signup">
            <div className="signup-box">
                <div className="heading">Signup</div>

                <div className="details-box">
                    <form className="details-box" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input type="submit" className="submit" />
                    </form>
                    <p className="loginOption">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
