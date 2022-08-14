export const apiGet = (path) => {
    return  fetch(path, {
        headers: getHeaders()
    })
}
export const getHeaders = () => {
    return  {'Authorization': 'Token ' + localStorage.getItem("token")}
}