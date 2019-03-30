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
    $$('#umap').hide();
    runAnimation();
}, false);

function checkLocation() {
    runAnimation(true, true);
    setTimeout(function () {
        let tzip = $$('input[name=zipcode]').val();
        if (validateZipCode(tzip)) {
            $$('#umap').show();
            $$('.mapbgimg').hide();
            GMaps.geocode({
                address: tzip,
                callback: function (results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        tmap = new GMaps({
                            el: '#umap',
                            lat: latlng.lat(),
                            lng: latlng.lng()
                        });

                        tmap.setCenter(latlng.lat(), latlng.lng());
                        tmap.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng()
                        });
                    }
                    runAnimation(true, false);
                    app.sheet.open('.location-sheet');
                }
            });
        } else {
            runAnimation(true, false);
            app.toast.show({
                text: 'Please enter a valid zip code.'
            });
            return;
        }
    }, 1000);
}

function test() {
    app.request.get('http://127.0.0.1:5000/query?location=11794', function (data) {
        console.log(data);
    });
}