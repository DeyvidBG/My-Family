var randomNumber = {}

// Generate random number with 6 digits
randomNumber.sixdigits = () => {
    var digit = Math.floor(100000 + Math.random() * 900000)
    return digit
}

module.exports = randomNumber