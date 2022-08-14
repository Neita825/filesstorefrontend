import {useCallback, useState} from "react";
import {isResponseOk} from "./IsResponseOk";

export const UploadFile = ({onUpload}) => {
    const[file, setFile] = useState();
    const[url, setUrl] = useState();
    const[message, setMessage] = useState();
    const submit = useCallback((event) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("url", url.replace(/^\/+/, ""));
        event.preventDefault()
        fetch("http://127.0.0.1:8000/upload/", {
            headers: {'Authorization': 'Token ' + localStorage.getItem("token")},
            method: "POST",
            body: formData
        })
            .then(isResponseOk)
            .then(() => {
                setMessage("Upload successful");
                onUpload();
            })
            .catch((err) => {
                console.log(err);
                setMessage("Error");
            });

    }, [file, url, onUpload]);
    return (
        <div>
            <form onSubmit={submit}>
                <div>Choose file</div>
                <input type="file" name="uploadedFile" onChange={event => setFile(event.target.files[0])} />
                <div>URL</div>
                <input type="string" name="URL" onChange={event => setUrl(event.target.value)}/>
                <input type="submit" value="Upload" />
                {message &&
                        <small>
                            {message}
                        </small>
                }
            </form>
        </div>
    )
}