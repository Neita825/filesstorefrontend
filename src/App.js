import React, {useState, useEffect, useCallback} from "react";
import {UploadFile} from "./components/Upload";
import {FilesList} from "./components/filesList";
import {CreateUser} from "./components/createUser";
import {isResponseOk} from "./utils/IsResponseOk";
import {apiGet} from "./utils/api";

function App() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [files, setFiles] = useState();
    const [isRegistration, setIsRegistration] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    const onSession = useCallback((data) => {
        if (data.auth) {
            setIsAuthenticated(true);
            getFile();
            getFileList();
            setCurrentUser(data.auth)
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated])

    const getSession = useCallback(() => {
        apiGet("http://127.0.0.1:8000/users/session/")
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
            apiGet("http://127.0.0.1:8000/" + url)
                .then(response => {
                    if (response.status === 200) {
                        fileName = response.headers.get('Content-Disposition').substring(21)
                        return response.blob()
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.location.href = "/";
                    setError("");
                })
                .catch(() => {
                    setError("File does not exist.");
                });


        }
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
        apiGet("http://127.0.0.1:8000/users/logout/")
            .then(isResponseOk)
            .then(() => {
                localStorage.setItem("token", "")
                setIsAuthenticated(false);
                setCurrentUser()
            })
    };

    const getFileList = () => {
        apiGet("http://127.0.0.1:8000/filesList/")
            .then(data => data.json())
            .then((data) => {
                setFiles(data)
            })
    }

    if (!isAuthenticated) {
        return (
            <div className="container mt-3">
                <h1>Filesstore</h1>
                {isRegistration ? <><h2>Registration</h2><CreateUser
                        setIsRegistration={setIsRegistration}/></> :
                    <><h2>Login</h2>
                        <form onSubmit={login}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" id="username" name="username"
                                       value={username} onChange={(event) => {
                                    setUsername(event.target.value);
                                }}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Password</label>
                                <input type="password" className="form-control" id="password" name="password"
                                       value={password} onChange={(event) => {
                                    setPassword(event.target.value);
                                }}/>
                                <div>
                                    {error &&
                                        <small className="text-danger">
                                            {error}
                                        </small>
                                    }
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => setIsRegistration(true)}>Registration
                            </button>
                        </form>
                    </>}
            </div>
        );
    }
    return (
        <div className="container mt-3">
            <h1>Filesstore</h1>
            <p>You are logged as {currentUser}!</p>
            <UploadFile onUpload={getFileList}/>
            <div>
                {error &&
                    <small className="text-danger">
                        {error}
                    </small>
                }
            </div>
            <FilesList files={files}/>
            <button style={{marginTop: 20}} className="btn btn-danger" onClick={logout}>Log out</button>
        </div>
    )

}

export default App;