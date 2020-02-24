// Container for the frontend application
var app = {}

// Config
app.config = {
    'sessionToken' : false
}

//AJAX Client (for the restful API)
app.client = {}

// Interface for making API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback) => {
    
    // Set defaults
    headers = typeof(headers) === 'object' && headers !== null ? headers : {}
    path = typeof(path) === 'string' ? path : '/'
    method = typeof(method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET'
    queryStringObject = typeof(queryStringObject) === 'object' && queryStringObject !== null ? queryStringObject : {} 
    payload = typeof(payload) === 'object' && payload !== null ? payload : {} 
    callback = typeof(callback) === 'function' ? callback : false

    // For each query string parameter sent, add it to the path
    var requestUrl = path + '?'
    var counter = 0
    for(var queryKey in queryStringObject) {
        if(queryStringObject.hasOwnProperty(queryKey)) {
            counter++
            // If at least one query string parameter has already been added, prepends new one with ampersant
            if(counter > 1){
                requestUrl += '&'
            }
            //Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey]
        }
    }


    // Form the http request as JSON type 
    var xhr = XMLHttpRequest()
    xhr.open(method, requestUrl, true)
    xhr.setRequestHeader('Content-Type', 'application/json')

    // For each header sent, add it to the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey])
        }
    }

    // If there is a current session time set, add that as a header
    if(app.config.sessionToken){
        xhr.setRequestHeader('token', app.config.sessionToken.id)
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            var statusCode = xhr.status
            var responseReturned = xhr.responseText

            // Callback if required
            if(callback) {
                try {
                    var parsedResponse = JSON.parse(responseReturned)
                    callback(statusCode, parsedResponse)
                } catch(err) {
                    callback(statusCode, false)
                }
            }
        }
    }

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload)
    xhr.send(payloadString)

}

// Bind the logout button
app.bindLogoutButton = () => {
    document.querySelector('#logoutButton').addEventListener('click', (e) => {

        // Stop it from redirecting anywhere
        e.preventDefault()

        // Log the user out
        app.logUserOut()

    })
}

// Log the user out then redirect them
app.logUserOut = () => {
    // Get the current id token
    var tokenId = typeof(app.config.sessionToken.id) === 'string' ? app.config.sessionToken.id : ''
    
    // Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
        'id' : tokenId
    }
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, () => {
        // Set the app.config token as false
        app.setSessionToken(false)

        // Send the user to the logged out page
        window.location = '/session/deleted'
    })
}

app.bindForm = () => {
    if(document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', (e) => {

            // Stop it from submitting
            e.preventDefault()
            var formId = this.id
            var path = this.action
            var method = this.method

            // Hide the error message if it is currently shown due to previous message
            document.querySelector('#' + formId + ' .formError').style.display = 'hidden'

            // Turn the inputs into payload
            var payload = {}
            var elements = this.elements
            for(var i = 0; i < elements.length; i++) {
                if(elements[i].type !== 'submit') {
                    var valueOfElement = elements[i].type === 'checkbox' ? elements[i].checked : ''
                    payload[elements[i]] = valueOfElement
                }
            }
        })

        // Call the API
        app.client.request(undefined, path, method, undefined, payload, (statusCode, responsePayload) => {
            if(statusCode !== 200){

                // Try to get the error from the API, or set a default error message
                var error = typeof(responsePayload.Error) === 'string' ? responsePayload.Error : 'Ops... Something went wrong!'

                // Set the form error field with the error text
                document.querySelector('#' + formId + ' .formError').innerText = error

                // Show (unhide) the form error message
                document.querySelector('#' + formId + ' .formError').style.display = 'block'

            } else {
                // If successful, send to form respone processor
                app.formResponseProcessor(formId, payload, responsePayload)
            }
        })
    }
}

// Form response processor 
app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
    var functionToCall = false
    // If account creation was successful, try to immediately log the user in
    if(formId = 'accountCreate') {
        // Take the phone and the password, and use theme to log the user in
        var newPayload = {
            'phone' : requestPayload.phone,
            'password' : requestPayload.password
        }

        app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, (newStatusCode, newResponsePayload) => {
            // Display an erro on the form if needed
            if(newStatusCode !== 200) {

                // Set the form error field with the error text
                document.querySelector('#' + formId + ' .formError').innerText = 'An error occurred'

                // Show (unhide) the form error message
                document.querySelector('#' + formId + ' .formError').style.display = 'block'

            } else {
                // If successful, set the token and redirect
                app.setSessionToken(newResponsePayload)
                window.location = 'checks/all'
            }
        })
    }
}

// Get the session token from the localstorage and set it in the app config object
app.getSessionToken = () => {
    var tokenString = localStorage.getItem('token')
    if(typeof(tokenString) === 'string') {
        try {
            var token = JSON.parse(tokenString)
            app.config.sessionToken = token
            if(typeof(token) === 'object') {
                app.setLoggedInClass(true)
            } else {
                app.setLoggedInClass(false)
            }
        } catch(e) {
            app.config.sessionToken = false
            app.setLoggedInClass(false)
        }
    }
}


// Set or remove the loggedIn class from the body
app.setLoggedInClass = (add) => {
    var target = document.querySelector('body')
    if(add) {
        target.classList.add('loggedIn')
    } else {
        target.classList.remove('loggedIn')
    }
}

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = (token) => {
    app.config.sessionToken = token
    var tokenString = JSON.stringify(token)
    localStorage.setItem('token', tokenString)
    if(typeof(token) === 'object') {
        app.setLoggedInClass(true)
    } else {
        app.setLoggedInClass(false)
    }
}

// Renew the token
app.renewToken = (callback) => {
    var currentToken = typeof(app.config.sessionToken) === 'object' ? app.config.sessionToken : false
    if(currentToken) {
        // Update the token with a new expiration
        var payload = {
            'id' : currentToken.id,
            'extend' : true 
        }
        app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, (statusCode) => {
            // Display an error on the form if needed
            if(statusCode === 200) {
                // Get the new token details
                var queryStringObject = {'id': currentToken.id}
                app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, (statusCode, responsePayload, callback) => {
                    // Display an error message on the form if needed
                    if(statusCode === 200) {
                        app.setSessionToken(responsePayload)
                        callback(false)
                    } else {
                        app.setSessionToken(false)
                        callback(true)
                    }
                })
            } else {
                app.setSessionToken(false)
                callback(true)
            }
        })
    } else {
        app.setSessionToken(false)
        callback(true)
    }
}

// Loop the renew token often
app.tokenRenewalLoop = () => {
    setInterval(() => {
        app.renewToken((err) => {
            if(!err) {
                console.log("Token renewed successfully @ " + Date.now())
            }
        })
    }, 1000 * 60)
}

// Init 
app.init = () => {

    // Bind all form submissions
    app.bindForm()

    // Bind logout logout button
    app.bindLogoutForm()

    // Get the token from localstorage
    app.getSessionToken()

    // Renew token
    app.renewToken()

}

// Call the init processes after the window loads
window.onload = () => {
    app.init()
}