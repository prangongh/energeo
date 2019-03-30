initializeApp(); //Entry point of app

function initializeApp() {
    initializeFirebase();
    initializeFramework7();
}

function initializeFirebase() {
    //To be implemented
}

function initializeFramework7() {
    $$ = Dom7;

    // Framework7 App main instance
    app = new Framework7({
        init: false,
        root: '#app', // App root element
        id: 'com.ryanoday.drinkup', // App bundle ID
        name: 'EngageWhiz', // App name
        theme: 'md', // Material Design Theme
        // App routes
        routes: _APPROUTES,
        // Enable panel left visibility breakpoint
        panel: {
            leftBreakpoint: 960,
            swipe: 'left',
            swipeActiveArea: 60
        },
        toast: {
            closeTimeout: 3500,
            closeButton: true
        }
    });

    leftView = app.views.create('.view-left', {
        url: '/menu_main',
        pushState: false,
        animate: false,
        routes: [{
            name: 'menu_main',
            path: '/menu_main',
            url: 'menu/main.html'
        }, {
            name: 'menu_signin',
            path: '/menu_signin',
            url: 'menu/signin.html'
        }]
    });

    // Init/Create main view
    mainView = app.views.create('.view-main', {
        url: '/',
        main: true,
        pushState: true
    });
    
    //Wait for views to be created before initializing app
    app.init();
}