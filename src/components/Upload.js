import {useCallback, useState} from "react";
import {isResponseOk} from "../utils/IsResponseOk";
import {getHeaders} from "../utils/api";

export const UploadFile = ({onUpload}) => {
    const [file, setFile] = useState();
    const [url, setUrl] = useState();
    const [message, setMessage] = useState();
    const submit = useCallback((event) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("url", url.replace(/^\/+/, ""));
        event.preventDefault()
        fetch("http://127.0.0.1:8000/upload/", {
            headers: getHeaders(),
            method: "POST",
            body: formData
        })
            .then(isResponseOk)
            .then(() => {
                setMessage("Upload successful");
                onUpload();
            })
            .catch(() => {
                setMessage("Error");
            });

    }, [file, url, onUpload]);
    return (
        <div>
            <form onSubmit={submit}>
                <div className="lead" style={{marginBottom: 20}}>Upload your file:</div>
                <div className="form-group">
                    <label htmlFor="uploadedFile">Choose file</label>
                    <div>
                        <input type="file" id="uploadedFile" name="uploadedFile"
                               onChange={event => setFile(event.target.files[0])}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="URL">Enter URL</label>
                    <input type="string" className="form-control" id="URL" name="URL"
                           onChange={event => setUrl(event.target.value)}/>
                </div>
                <button className="btn btn-primary" type="submit" value="Upload">Upload
                </button>
                <div>{message &&
                    <small>
                        {message}
                    </small>
                }
                </div>
            </form>
        </div>
    )
}