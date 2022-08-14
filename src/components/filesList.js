import {FileItem} from "./fileItem";

export const FilesList = ({files}) => {
    if (files) {

        return (
            <div>
                <div className="lead" style={{marginTop: 20}}>Your files:</div>
                <table className="table">
                    <thead>
                    <th>URL</th>
                    <th>Revision</th>
                    </thead>
                    <tbody>
                    {files.map((file) =>
                        <FileItem key={file.url} file={file}/>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}