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
    $$('.viewinfobtn').hide();
    runAnimation();
}, false);

function checkLocation() {
    runAnimation(true, true);
    let tpreloader = app.dialog.preloader('Evaluating location...');
    setTimeout(function () {
        let tzip = $$('input[name=zipcode]').val();
        if (validateZipCode(tzip)) {
            $$('#umap').show();
            $$('.mapbgimg').hide();
            $$('.viewinfobtn').show();
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
                    backendRequest(tzip, tpreloader);
                }
            });
        } else {
            runAnimation(true, false);
            tpreloader.close();
            app.toast.show({
                text: 'Please enter a valid zip code.'
            });
            return;
        }
    }, 5000);
}

function backendRequest(zip, zpreloader) {
    
    //app.sheet.open('.location-sheet');
    app.request.get('http://127.0.0.1:5000/query?location=' + zip, function (data) {
        let results = JSON.parse(data);
        console.log(results.wind.score);
        app.popup.open('.popup-results');
        let scoregauge = app.gauge.create({
            el: '.scoregauge',
            type: 'semicircle',
            borderColor: '#4285f4',
            value: results.wind.score / 100,
            valueText: Math.floor(results.wind.score) + '%'
        });
        runAnimation(true, false);
        zpreloader.close();
    });
}