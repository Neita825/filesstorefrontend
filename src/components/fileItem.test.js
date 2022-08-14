import {fireEvent, render, screen} from "@testing-library/react";
import {FileItem} from "./fileItem";


describe("fileList", () => {
    let file
    beforeEach(() => {
        file = {url: "test", lastRevision: "3"}
    });
    it("urlCreate", () => {
        render(
            <FileItem file={file}/>
        )
        let item = screen.getByTestId("item")
        expect(item.getAttribute('href')).toBe("test")
        expect(item.innerHTML).toBe("http://localhost/test")
    })
    it("selestRevision", () => {
        render(
            <FileItem file={file}/>
        )
        fireEvent.change(screen.getByTestId("selestRevision"), { target: { value: 1 } })
        let item = screen.getByTestId("item")
        expect(item.getAttribute('href')).toBe("test?revision=1")
        expect(item.innerHTML).toBe("http://localhost/test?revision=1")
    })
    it("revisions", () => {
        render(
            <FileItem file={file}/>
        )
        let item = screen.getAllByTestId("revisions")
        expect(item.length).toBe(4)
    })
})