dateObjects = {}

dateObjects.fullDate = (date) => {
    var today = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    var year = date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear()

    return today + '/' + month + '/' + year
}

dateObjects.fullHour = (date) => {
    return date.getHours() + ':' + date.getMinutes()
}