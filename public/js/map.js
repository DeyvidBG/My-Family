window.addEventListener('load', () => {

    var el = document.createElement('div')
    el.className = 'marker'

    var mymap

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            mymap = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13)

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV5dmlkcCIsImEiOiJjamx4ZXQzdWYxOXltM3dxdjhza2Q3Yjl6In0.BhANnyLKRU6U6tN559RPlw', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 20,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZGV5dmlkcCIsImEiOiJjamx4ZXQzdWYxOXltM3dxdjhza2Q3Yjl6In0.BhANnyLKRU6U6tN559RPlw'
            }).addTo(mymap)

            console.log(mymap)

        },
        (err) => { console.log(err),
        {enableHighAccuracy: true}}
        )
    }

    // Open newTask modal
    $('.addObject').on('click', () => {
        $('.blackShadow').show()
        $('.newObject').css('display', 'flex')
    })

    // Check for the length of the text in textarea
    $('#description').on('input', () => {
        var txt = $('#description').val()
        if(txt.split('').length > 250) {
            $('#description').css('border-color', 'rgba(245,0,87,0.5)')
            $('.addNewObject').css({'background-color': 'rgba(245,0,87,1)', 'cursor': 'not-allowed'})
            $('.addNewObject').attr('disabled','true')
        } else if(txt.split('').length <= 250) {
            $('#description').css('border-color', 'rgba(108, 99, 255, 0.5)')
            $('.addNewObject').css({'background-color': '#06d19c', 'cursor': 'pointer'})
            $('.addNewObject').removeAttr("disabled")
        }
    })

    // Close all modals
    $('.close').on('click', closeAllModals)
})

// to be better made !!! function plus argument for the current modal
// Close all opened modals
var closeAllModals = () => {
    $('.blackShadow').hide()
    $('.modal').hide()
}