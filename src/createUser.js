import {useCallback, useState} from "react";
import {isResponseOk} from "./IsResponseOk";

export const CreateUser = () => {
    const[username, setUsername] = useState();
    const[password, setPassword] = useState();
    const[message, setMessage] = useState();
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
                <div>Username</div>
                <input type="string" name="username" onChange={event => setUsername(event.target.value)} />
                <div>Password</div>
                <input type="string" name="password" onChange={event => setPassword(event.target.value)}/>
                <input type="submit" value="Create user" />
                {message &&
                    <small>
                        {message}
                    </small>
                }
            </form>
        </div>
    )
}


