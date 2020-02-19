var security = {}

security.passwordValidator = (pass) => {
    let flag = true

    // Checking for lowercase letters
    var lowerCaseLetter = /[a-z]/g
    if(!pass.match(lowerCaseLetter)) {
        flag = false
    }

    // Checking for uppercase letters
    var upperCaseLetter = /[A-Z]/g
    if(!pass.match(upperCaseLetter)) {
        flag = false
    }

    // Checking for digits
    var numbers = /[0-9]/g
    if(!pass.match(numbers)) {
        flag = false
    }

    // Checking the length of the password
    if(!(pass.length >= 10)) {
        flag = false
    }

    return flag
}

// Looking for 10 digit phone number with "+"
// security.phoneValidator = (phone) => {
//     var phoneNumber = /^\+?([0-9]{3})\)?([0-9]{9})$/
//     if(phone.match(phoneNumber)) {
//         return true
//     } else {
//         return false
//     }
// }

// Checking for valid date 
security.dateValidator = (date) => {

    let flag = true

    // First check for the pattern
    if(!/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/.test(date))
        flag = false

    // Parse the date parts to integers
    var parts = date.split("/")
    var day = parseInt(parts[0], 10)
    var month = parseInt(parts[1], 10)
    var year = parseInt(parts[2], 10)

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        flag = false

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29

    // Check the range of the day
    if(day < 0 || day > monthLength[month - 1]) {
        flag = false
    }

    return flag
}

// Check emails for right pattern
security.emailValidator = (email) => {

    var goodEmailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(email.match(goodEmailPattern)) {
        return true
    } else {
        return false
    }

}

module.exports = security
