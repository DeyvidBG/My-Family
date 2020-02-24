window.addEventListener('DOMContentLoaded', () => {
    var form = document.querySelector('form')

    form.addEventListener('submit', (e) => {
        e.preventDefault() 

        var html = ''

        var email = $('#email').val()
        var pass = $('#password').val()

        // Sending POST request to our server with client's data
        $.ajax({
            url: '/auth',
            type: 'POST',
            data: {
                'pass': pass, 'email': email
            },
            success: (data) => {

                // waiting for response
                // 1 - success
                // 2 - success - no family member
                // 3 - fail

                if(data.code === 1) {
                    window.location.assign('/dashboard')
                } else if(data.code === 2) {
                    window.location.assign('/createFamily')
                }
                    // Do something
                }
            })
    })
})