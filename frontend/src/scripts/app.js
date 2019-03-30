//Wrapper function for page init event to prevent event from firing when going back
function onPageInit(pagename, callback, initialonly = true) {
    $$(document).on('page:init', '.page[data-name="' + pagename + '"]', function (e) {
        if (initialonly) {
            if (e.detail.direction !== 'backward') {
                callback(e);
            }
        } else {
            callback(e);
        }
    });
}

$$(document).on('page:init', function (e) {
    if (app.device.desktop) {
        $$('.mobilemenubutton').hide();
    }
});

function validateZipCode(zipcode) {
    return /^\b\d{5}(-\d{4})?\b$/.test(zipcode);
}

onPageInit('home', function () {
    tmap = new GMaps({
        el: '#umap',
        lat: '40.915616',
        lng: '-73.125152'
    });
    tmap.setCenter('40.915616', '-73.125152', function () {
        //map centered
    });
    runAnimation();
}, false);

function checkLocation() {
    let tzip = $$('input[name=zipcode]').val();
    if (validateZipCode(tzip)) {
        GMaps.geocode({
            address: tzip,
            callback: function(results, status) {
              if (status == 'OK') {
                var latlng = results[0].geometry.location;
                tmap.setCenter(latlng.lat(), latlng.lng());
                tmap.addMarker({
                  lat: latlng.lat(),
                  lng: latlng.lng()
                });
              }
            }
          });
    } else {
        app.toast.show({
            text: 'Please enter a valid zip code.'
        });
        return;
    }
}