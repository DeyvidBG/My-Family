window.addEventListener('load', () => {
    
    $('.delete').on('click', function() {
        var id = $(this).closest('.photo').attr('data-photo')
        $.ajax({
            url: '/gallery/deletePhoto',
            type: 'POST',
            data: {
                photoId: id
            },
            success: (data) => {

                if(data.code === 1) {
                    $(`.photo[data-photo=${id}]`).remove()
                } else {
                    // Do something
                }

            }
        })
    })

    // Open add album modal
    $('.addImage').on('click', () => {
        $('.blackShadow').show()
        $('.addNewImage').css('display', 'flex')
    })

    // Close all modals
    $('.close').on('click', closeAllModals)

})

// to be better made !!! function plus argument for the current modal
// Close all opened modals
var closeAllModals = () => {
    $('.addNewImage').hide()
    $('.blackShadow').hide()
}