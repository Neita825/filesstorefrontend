import {useCallback, useState} from "react";
import {isResponseOk} from "../utils/IsResponseOk";
import React from "react";

export const CreateUser = ({setIsRegistration}) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [message, setMessage] = useState();
    const submit = useCallback((event) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        event.preventDefault()
        fetch("http://127.0.0.1:8000/users/registration/", {
            method: "POST",
            body: formData
        })
            .then(isResponseOk)
            .then(() => {
                setMessage("User successfully created");
            })
            .catch((err) => {
                console.log(err);
                setMessage("Error");
            });
    }, [username, password]);
    return (
        <div>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" name="username"
                           value={username} onChange={(event) => {
                        setUsername(event.target.value);
                    }}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password"
                           value={password} onChange={(event) => {
                        setPassword(event.target.value);
                    }}/>
                    <div>
                        {message &&
                            <small>
                                {message}
                            </small>
                        }
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Create user</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsRegistration(false)}>Return</button>
            </form>
        </div>
    )
}


