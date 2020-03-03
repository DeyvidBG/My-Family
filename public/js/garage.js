window.addEventListener('load', () => {

    if('.setNewGtp') {
        $('#nGtp').attr('value', addDays(365))
    }

    $('.addNewCar').on('click', () => {

        // Open modal
        $('.blackShadow').show()
        $('.newCar').css('display', 'flex')

    })

    $('#description').on('input', () => {
        var txt = $('#description').val()
        if(txt.split('').length > 250) {
            $('#description').css('border-color', 'rgba(245,0,87,0.5)')
            $('.addNewCarBtn').css({'background-color': 'rgba(245,0,87,1)', 'cursor': 'not-allowed'})
            $('.addNewCarBtn').attr('disabled','true')
        } else if(txt.split('').length <= 250) {
            $('#description').css('border-color', 'rgba(108, 99, 255, 0.5)')
            $('.addNewCarBtn').css({'background-color': '#06d19c', 'cursor': 'pointer'})
            $('.addNewCarBtn').removeAttr("disabled")
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

    // On submit form
    $('#newCar').on('submit', (e) => {
        e.preventDefault()

        var name = $('#name').val()
        var description = $('#description').val()
        var gtp = $('#gtp').val()
        var service = $('#kons').val()

        $.ajax({
            url: '/garage/addNewCar',
            type: 'POST',
            data: {
                'name': name,
                'description': description,
                'gtp': gtp,
                'service': service
            },
            success: (data) => {
                if(data.code === 1) {
                    closeAllModals()
                    newCarBox(data.id, name, description, gtp, service)

                    var prevCount = $('#carsCount').text()
                    $('#carsCount').text(parseInt(prevCount)+1)

                } else {
                    console.log('Error')
                }
            }
        })

    })

    $('.deleteCar').on('click', function () {
        var id = $(this).closest('.car').attr('data-id')

        $.ajax({
            url: '/garage/deleteCar',
            type: 'POST',
            data: {
                'id': id
            },
            success: (data) => {
                if(data.code === 1) {
                    $(`.car[data-id=${id}]`).remove()

                    var prevCount = $('#carsCount').text()
                    $('#carsCount').text(parseInt(prevCount)-1)

                } else {
                    console.log('Error')
                }
            }
        })
    })

    $('#newGtp').on('submit', function (e){
        e.preventDefault()

        var id = $(this).closest('.setNewGtp').attr('data-id')
        var newDate = $('#nGtp').val()

        $.ajax({
            url: '/garage/setNewGtp',
            type: 'POST',
            data: {
                'id': id,
                'newDate': newDate
            },
            success: (data) => {
                if(data.code === 1) {
                    $(`.car[data-id=${id}] #gtpText`).text(newDate)
                    $(`.setNewGtp[data-id=${id}]`).remove()
                    if($('.setNewGtp').length > 0) {
                        // Do something
                    } else {
                        $('.blackShadow').hide()
                    }
                } else {
                    console.log('Error')
                }
            }
        })
    })

    // Close all modals
    $('.close').on('click', closeAllModals)

})

// Close all opened modals
var closeAllModals = () => {
    $('.newCar').hide()
    $('.blackShadow').hide()
}

var newCarBox = (id, name, description, gtp, service) => {
    var htmlCode = `<div class="car" data-id="${id}">
                        <p class="carName"><b>Наименование/модел: </b>${name}</p>
                        <p class="description"><b>Описание: </b>${description}</p>
                        <p><b>Следващ годишен технически преглед: </b>${gtp}</p>
                        <p><b>Смяна на консумативи: </b>${service}</p>
                        <center><p>Опция за премахване ще бъде добавена при следващо зареждане на страницата!</p></center>
                    </div>`

    $('#garage').append(htmlCode)
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