var dateConverter = {}

dateConverter.convertUserToMySQL = (date) => {

    // Parse the date parts to integers
    var parts = date.split("/")
    var day = parseInt(parts[0], 10)
    var month = parseInt(parts[1], 10)
    var year = parseInt(parts[2], 10)

    // Returning following date forat YYYY-MM-DD
    return year + '-' + month + '-' + day
    
}

module.exports = dateConverter
