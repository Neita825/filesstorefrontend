import React, {useState, useEffect, useCallback} from "react";
import {UploadFile} from "./Upload";
import {FilesList} from "./filesList";
import {CreateUser} from "./createUser";
import {isResponseOk} from "./IsResponseOk";

function App() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [files, setFiles] = useState()

    const onSession = useCallback((data) => {
        if (data.auth) {
            setIsAuthenticated(true);
            getFile();
            getFileList();
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated])

    const getSession = useCallback(() => {
        fetch("http://127.0.0.1:8000/users/session/", {
            headers: {'Authorization': 'Token ' + localStorage.getItem("token")}
        })
            .then((res) => res.json())
            .then(onSession)
            .catch(() => {
                localStorage.setItem("token", "")
            });
    }, [onSession])

    useEffect(() => {
        getSession()
    }, [getSession])

    const getFile = () => {
        if (window.location.pathname !== '/') {
            const url = window.location.pathname + window.location.search;
            let fileName = "";
            fetch("http://127.0.0.1:8000/" + url, {
                headers: {'Authorization': 'Token ' + localStorage.getItem("token")}
            })
                .then(response => {
                    if (response.status === 200) {
                        fileName = response.headers.get('Content-Disposition').substring(21)
                        return response.blob()
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(blob => {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.location.href = "/";
                });
        }
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleUserNameChange = (event) => {
        setUsername(event.target.value);
    }

    const login = (event) => {
        event.preventDefault();
        fetch("http://127.0.0.1:8000/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: username, password: password}),
        })
            .then(isResponseOk)
            .then((data) => {
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
                setUsername("");
                setPassword("");
                setError("");
                getSession();
            })
            .catch(() => {
                setError("Wrong username or password.");
            });
    }

    const logout = () => {
        fetch("http://127.0.0.1:8000/users/logout/", {
            headers: {'Authorization': 'Token ' + localStorage.getItem("token")}
        })
            .then(isResponseOk)
            .then(() => {
                localStorage.setItem("token", "")
                setIsAuthenticated(false);
            })
    };

    const getFileList = () => {
        fetch("http://127.0.0.1:8000/filesList/", {
            headers: {'Authorization': 'Token ' + localStorage.getItem("token")}
        })
            .then(data => data.json())
            .then((data) => {
                setFiles(data)
            })
    }


    if (!isAuthenticated) {
        return (
            <div className="container mt-3">
                <br/>
                <p>Filesstore</p>
                <h2>Registration</h2>
                <CreateUser></CreateUser>
                <h2>Login</h2>
                <form onSubmit={login}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" name="username"
                               value={username} onChange={handleUserNameChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Password</label>
                        <input type="password" className="form-control" id="password" name="password"
                               value={password} onChange={handlePasswordChange}/>
                        <div>
                            {error &&
                                <small className="text-danger">
                                    {error}
                                </small>
                            }
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        );
    }
    return (
        <div className="container mt-3">
            <p>Filesstore</p>
            <p>You are logged in!</p>
            <UploadFile onUpload={getFileList}></UploadFile>
            <FilesList files={files}></FilesList>
            <button className="btn btn-danger" onClick={logout}>Log out</button>
        </div>
    )

}

export default App;