import {useState} from "react";

export const FileItem = ({file}) => {
    const [revision, setRevision] = useState("latest")
    const revisions = (lastRevision) => {
        const options = []
        for (let i = 0; i < lastRevision; i++) {
            options.push(<option key={i} data-testid="revisions" value={i}>{i}</option>)
        }
        options.push(<option key="latest" data-testid="revisions" value="latest">latest</option>)
        return options
    }
    let revisionUrl
    if (revision !== "latest") {
        revisionUrl = "?revision=" + revision
    } else {
        revisionUrl = "";
    }
    return <tr key={file.url}>
        <td><a data-testid="item" href={file.url + revisionUrl}>{window.location.origin + "/" + file.url + revisionUrl}</a></td>
        <td><select data-testid="selestRevision" value={revision} onChange={(event) => setRevision(event.target.value)}>
            {revisions(file.lastRevision)}
        </select></td>
    </tr>
}