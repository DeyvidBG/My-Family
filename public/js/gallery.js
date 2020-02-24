window.addEventListener('load', () => {
    
    $('#description').on('input', function () {
        var txt = $(this).val()
        if(txt.split('').length > 250) {
            $(this).css('border-color', 'rgba(245,0,87,0.5)')
            $('.createIt').css({'background-color': 'rgba(245,0,87,1)', 'cursor': 'not-allowed'})
            $('.createIt').attr('disabled','true')
        } else if(txt.split('').length <= 250) {
            $(this).css('border-color', 'rgba(108, 99, 255, 0.5)')
            $('.createIt').css({'background-color': '#06d19c', 'cursor': 'pointer'})
            $('.createIt').removeAttr("disabled")
        }
    })

    $('#newAlbum').on('submit', (e) => {
        
        // Prevent from submitting
        e.preventDefault()

        var title = $('#title').val()
        var description = $('#description').val()

        // Sending Post request to the server with client's data
        $.ajax({
            url: '/gallery/addAlbum',
            type: 'POST',
            data: {
                'title': title,
                'description': description
            }, 
            success: (data) => {
                
                // 1 - success
                // 2 - fail
                $('.emptyGallery').remove()
                albumHtml(title, `/gallery/${data.id}`)
                closeAllModals()

            }
        })

    })

    // Open add album modal
    $('.addAlbum').on('click', () => {
        $('.blackShadow').show()
        $('.createNewAlbum').css('display', 'flex')
    })

    // Close all modals
    $('.close').on('click', closeAllModals)

})

// to be better made !!! function plus argument for the current modal
// Close all opened modals
var closeAllModals = () => {
    $('.createNewAlbum').hide()
    $('.blackShadow').hide()
}


var albumHtml = (title, url) => {
    var htmlCode = `<a href="${url}"><div class="album">
                        <i class="fas fa-folder fa-5x"></i>    
                        ${title}
                    </div></a>`
    $('.gallery').append(htmlCode)
}