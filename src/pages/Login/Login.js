import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("auth/login", {
                email,
                password,
            });
            setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
            navigate("/");

            // console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="Login">
            <div className="login-box">
                <div className="heading">Login</div>

                <div className="details-box">
                    <form className="details-box" onSubmit={handleSubmit}>
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
                    <p className="signupOption">
                        Do not have a account? <Link to="/signup">Signup</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
