window.addEventListener('load', () => {

    var mymap = L.map('map')
    var draggableMarkers = []
    var colors = ['rgba(245,0,87,1)', '#F9A826', '#6c63ff', '#06d19c']

    // Getting all points
    $.ajax({
        url: '/map/getPoints',
        type: 'GET',
        data: {},
        success: (data) => {
            if(data.code === 1) {
                if(data.result.length > 0) {
                    data.result.forEach(point => {
                        circle = new L.circle([point.lat, point.lng], {radius: 100, fill: true, color: colors[point.color-1]}).bindPopup(`<h1>${point.title}</h1><p>${point.description}</p>`)
                        mymap.addLayer(circle)
                    })
                }
            } else if(data.code === 2) {
                console.log('Problem...')
            }
        }
    })


    // Showing instructions
    var toBeShowed = localStorage.getItem('toBeShowed')
    if(toBeShowed === null) {
        $('.blackShadow').show()
        $('.info').css('display', 'flex')
        localStorage.setItem('toBeShowed', false)
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            mymap.setView([position.coords.latitude, position.coords.longitude], 13)

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV5dmlkcCIsImEiOiJjamx4ZXQzdWYxOXltM3dxdjhza2Q3Yjl6In0.BhANnyLKRU6U6tN559RPlw', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 20,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoiZGV5dmlkcCIsImEiOiJjamx4ZXQzdWYxOXltM3dxdjhza2Q3Yjl6In0.BhANnyLKRU6U6tN559RPlw'
            }).addTo(mymap)

        },
        (err) => { console.log(err),
        {enableHighAccuracy: true}}
        )
    }

    mymap.on('click', (e) => {
        // Checking for previous markers
        if(draggableMarkers.length > 0) {
            mymap.removeLayer(draggableMarkers[draggableMarkers.length-1])
            draggableMarkers.shift()
        }
        // Creating new marker
        marker = new L.marker(e.latlng, {draggable:'true'})
        
        // Adjust to inputs 
        $('#lat').val(e.latlng.lat)
        $('#lng').val(e.latlng.lng)

        draggableMarkers.push(marker)

        // Looking for the coords after drag ends
        marker.on('dragend', (event) => {
            var marker = event.target
            var position = marker.getLatLng()
            marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'})
            mymap.panTo(new L.LatLng(position.lat, position.lng))
            
            // Adjust to inputs 
            $('#lat').val(position.lat)
            $('#lng').val(position.lng)

        })
        mymap.addLayer(marker)
    })

    $(document).on('keypress', (e) => {

        // Looking for 'd' or 'д'
        if(e.keyCode === 100 || e.keyCode === 1072) {
            if(draggableMarkers.length > 0) {
                mymap.removeLayer(draggableMarkers[draggableMarkers.length-1])
                draggableMarkers.shift()
            }
        }

    })

    // Open newTask modal
    $('.addObject').on('click', () => {
        $('.blackShadow').show()
        $('.newObject').css('display', 'flex')
    })

    $('.openHelp').on('click', () => {
        $('.blackShadow').show()
        $('.info').css('display', 'flex')
    })

    // Add new object 
    $('#newObject').on('submit', (e) => {
        // Prevent from redirecting/refreshing the page due to form submit
        e.preventDefault()

        var title = $('#title').val()
        var description = $('#description').val()
        var lat = $('#lat').val()
        var lng = $('#lng').val()
        var color = $('#color').val()

        $.ajax({
            url: '/map/addNewObject',
            type: 'POST',
            data: {
                'title': title,
                'description': description,
                'lat': lat,
                'lng': lng,
                'color': color
            },
            success: (data) => {
                if(data.code === 1) {
                    $('#lat').val('')
                    $('#lng').val('')
                    closeAllModals()

                    circle = new L.circle([lat, lng], {radius: 100, fill: true, color: colors[color-1]}).bindPopup(`<h1>${title}</h1><p>${description}</p>`)
                    mymap.addLayer(circle)

                    var prevCount = $('#objectsCount').text()
                    $('#objectsCount').text(parseInt(prevCount)+1)

                } else {
                    alert('Some error...')
                }
            }
        })


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