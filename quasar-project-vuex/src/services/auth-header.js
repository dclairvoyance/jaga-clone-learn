export const authHeader = () => {
    let user = JSON.parse(localStorage.getItem("user") || 'null')

    if (user) {
        return { Authorization: 'Bearer ' + user }
    } else {
        return {}
    }
}