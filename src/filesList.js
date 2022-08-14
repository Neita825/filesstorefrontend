import {FileItem} from "./fileItem";

export const FilesList = ({files}) => {
    if (files) {

        return (
            <div>
                {files.map((file) =>
                   <FileItem key={file.url} file={file}></FileItem>
                )}
            </div>
        )
    }
}