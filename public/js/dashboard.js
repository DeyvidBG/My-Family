window.addEventListener('DOMContentLoaded', () => {

    // Fetch data from DB for user
    $.ajax({
        url: '/dashboard/user',
        type: 'GET',
        success: (data) => {
            $('#name').text(data.name)

            var stats = {}

            data.stats.forEach((el) => {
                stats[el.key] = el.value
            })

            var inProgress = typeof(stats['in progress']) !== "undefined" ? stats['in progress'] : 0
            var offShedule = typeof(stats['off schedule']) !== "undefined" ? stats['off schedule'] : 0
            var completed = typeof(stats['completed']) !== "undefined" ? stats['completed'] : 0
            var planned = typeof(stats['planned']) !== "undefined" ? stats['planned'] : 0

            var allInOne = parseInt(inProgress + offShedule + completed + planned)

            // Displaying the info about the stats
            $('#allInOne').text(allInOne)
            $('#completed').text(completed)
            $('#offShedule').text(offShedule)
            $('#inProgress').text(inProgress)

            // animateStats()
            data.familyMembers.forEach((member) => {
                // Displaying family members
                $('.members ul').append(`<li>${member.Name} присъединил се на ${member.date}</li>`)
            })

        }
    })

    // Fetch data from DB for events
    $.ajax({
        url: '/dashboard/events',
        type: 'GET',
        success: (data) => {
            if(data.events.length > 0) {
                data.events.forEach(event => {
                    addEvent(event.id, event.title, event.description, event.date, event.kind)
                })
            }
        }
    })

})

window.onload = () => {

    // Check for the length of the text in textarea
    $('#description').on('input', () => {
        var txt = $('#description').val()
        if(txt.split('').length > 250) {
            $('#description').css('border-color', 'rgba(245,0,87,0.5)')
            $('.newTask').css({'background-color': 'rgba(245,0,87,1)', 'cursor': 'not-allowed'})
            $('.newTask').attr('disabled','true')
        } else if(txt.split('').length <= 250) {
            $('#description').css('border-color', 'rgba(108, 99, 255, 0.5)')
            $('.newTask').css({'background-color': '#06d19c', 'cursor': 'pointer'})
            $('.newTask').removeAttr("disabled")
        }
    })

    $('#email').on('input', () => {
        if(!validation.emailValidator($('#email').val())) {
            $('#email').css('border-color', 'rgba(245,0,87,0.5)')
            $('#addMember').css({'background-color': 'rgba(245,0,87,1)', 'cursor': 'not-allowed'})
            $('#addMember').attr('disabled','true')
        } else {
            $('#email').css('border-color', 'rgba(108, 99, 255, 0.5)')
            $('#addMember').css({'background-color': '#06d19c', 'cursor': 'pointer'})
            $('#addMember').removeAttr("disabled")
        }
    })

    // Add task
    $('#task').on('submit', (e) => {
        e.preventDefault()

        var title = $('#title').val()
        var description = $('#description').val()
        var date = $('#date').val()
        var type = $('#type').val()

        $.ajax({
            url: '/dashboard/addTask',
            type: 'POST',
            data: {
                'title' : title,
                'description' : description,
                'date' : date,
                'type' : type
            },
            success: (data) => {
                if(data.status) {
                    console.log('Success')
                    // Display the event
                    addEvent(data.taskId, title, description, date, type)

                    // Close the pop-up window
                    closeAllModals()
                }
            }
        })
    })

    // Add member
    $('#member').on('submit', (e) => {
        e.preventDefault()

        var email = $('#email').val()

        $.ajax({
            url: '/dashboard/newMember',
            type: 'POST',
            data: {
                'email': email
            },
            success: (data) => {
                // Do something
                if(data.status) {
                    closeAllModals()
                }
            }
        })
    })

    // Set repetition
    $('#repeat').on('submit', function (e) {
        e.preventDefault()

        var taskId = $(this).closest('.repeatTask').attr('data-id')
        var newDate = $('#repeatDate').val()

        $.ajax({
            url: '/dashboard/setRepetition',
            type: 'POST',
            data: {
                'taskId': taskId,
                'newDate': newDate
            }, 
            success: (data) => {
                if(data.status) {
                    closeAllModals()
                }
            }
        })

    })

    // Delete task 
    $('.deleteEvent').on('click', function () {
        if($('.deleteTaskModal').is(':visible')) {
            var taskId = $(this).closest('.deleteTaskModal').attr('data-id')
        } else if($('.repeatTask').is(':visible')) {
            var taskId = $(this).closest('.repeatTask').attr('data-id') 
        }

        $.ajax({
            url: '/dashboard/deleteTask',
            type: 'POST',
            data: {
                'taskId': taskId
            },
            success: (data) => {

                if(data.status) {
                    closeAllModals()
                    $(`.activity[data-id="${taskId}"]`).remove()
                }

            }
        })
    })

    // Open newTask modal
    $('#newTask').on('click', () => {
        $('.blackShadow').show()
        $('.addTask').css('display', 'flex')
    })

    // Open addMember modal
    $('.newMember').on('click', () => {
        $('.blackShadow').show()
        $('.addMemberModal').css('display', 'flex')
    })

    // Open deleteTask modal
    $('.delete').on('click', function () {
        $('.blackShadow').show()
        $('.deleteTaskModal').attr('data-id', $(this).closest('.activity').attr('data-id'))
        $('.deleteTaskModal').css('display', 'flex')
    })

    // Open repeatTask modal 
    $('.ready').on('click', function () {
        $('.repeatTask').attr('data-kind', $(this).closest('.activity').attr('data-kind'))
        $('.repeatTask').attr('data-id', $(this).closest('.activity').attr('data-id'))
        if(parseInt($(this).closest('.activity').attr('data-kind')) === 1) {
            var taskId = $(this).closest('.repeatTask').attr('data-id')

            $.ajax({
                url: '/dashboard/deleteTask',
                type: 'POST',
                data: {
                    'taskId': taskId
                },
                success: (data) => {
    
                    if(data.status) {
                        closeAllModals()
                        $(`.activity[data-id="${taskId}"]`).remove()
                    }
    
                }
            })
        } else {
            $('.blackShadow').show()
            $('.repeatTask').css('display', 'flex')
            var taskKind = parseInt($('.repeatTask').attr('data-kind'))

            if(taskKind === 2) {

                $('#repeatDate').attr('value', addDays(1))

            }

            if(taskKind === 3) {

                var today = new Date()
                var day = today.getDay()
                var days = 0
                if(day === 5) {
                    days = 3
                } else if(day === 6) {
                    days = 2
                } else if(day === 7) {
                    days = 1
                }

                $('#repeatDate').attr('value', addDays(days))
            } 

            if(taskKind === 4) {

                $('#repeatDate').attr('value', addDays(7))

            }

            if(taskKind === 5) {

                $('#repeatDate').attr('value', addDays(31))

            }

            if(taskKind === 6) {

                $('#repeatDate').attr('value', addDays(365))

            }

        }

    })

    // Close all modals
    $('.close').on('click', closeAllModals)

}

var addEvent = (id, title, description, date, kind) => {
    var htmlCode = `<div class="activity" data-id="${id}" data-kind="${kind}">
        <h3>${title}</h3>
        <p class="activityDescription">${description}</p>
        <div class="optionsBar">
            <span id="lastOpened">${date}</span>
            <button class="btn options delete"><i class="fas fa-trash"></i></button>
            <button class="btn options ready"><i class="fas fa-clipboard-check"></i></button>
        </div>
    </div>`
    $('.mainWrapper').append(htmlCode)
}


// Animating stats digits
// var animateStats = () => {
//     $('.stats').each(function () {
//         $(this).prop('Counter', 0).animate({
//             Counter: $(this).text()
//         }, {
//             duration: 5000,
//             easing: 'swing',
//             step: function (now) {
//                 $(this).text(Math.ceil(now))
//             }
//         })
//     })
// }


// to be better made !!! function plus argument for the current modal
// Close all opened modals
var closeAllModals = () => {
    $('.addTask').hide()
    $('.addMemberModal').hide()
    $('.deleteTaskModal').hide()
    $('.repeatTask').hide()
    $('.blackShadow').hide()
}

// Set for repeating tasks
var addDays = (days) => {
    var result = new Date()
    result.setDate(result.getDate() + days)

    var dd = String(result.getDate()).padStart(2, '0')
    var mm = String(result.getMonth() + 1).padStart(2, '0')
    var yyyy = result.getFullYear()

    return String(yyyy + '-' + mm + '-' + dd)
  }