// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('didplayer', ['ionic','ngCordova']);

app.run(function($ionicPlatform, $rootScope, $ionicPopup, FileObj, Device, ClockSrv, $filter) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
        // StatusBar.styleDefault();
        StatusBar.hide();
        }

        FileObj.set(cordova.file);

        Device.set(ionic.Platform.device());

        window.open = cordova.InAppBrowser.open;

    });


    ClockSrv.clock(function() {
      // console.log($filter('date')(Date.now(), 'yyyy-MM-dd HH:mm:ss'));
      var today = new Date();
      var week_arr = new Array('일', '월', '화', '수', '목', '금', '토');
      var week = week_arr[today.getDay()];

      $rootScope.clock_HM = $filter('date')(Date.now(), 'HH:mm');
      $rootScope.clock_YMD = $filter('date')(Date.now(), 'MM월 dd일 ') + week + "요일";
    });

    //back button action
    $ionicPlatform.registerBackButtonAction(function(e) {

        e.preventDefault();

        $rootScope.exitApp = function() {
            $ionicPopup.confirm({
                title: "<strong>앱을 종료할까요?</strong>",
                template: '확인하시면 앱을 종료할 수 있습니다.',
                buttons: [
                    { text: '취소' },
                    {
                        text: '<b>종료</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            ionic.Platform.exitApp();
                        }
                    }
                ]
            });
        };
        $rootScope.exitApp();

        return false;
    }, 101);
});

app.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('player', {
      url: '/',
      templateUrl: './templates/player.html',
      controller: "playerCtrl"
    });
  $urlRouterProvider.otherwise("/");
});

app.filter('trustUrl', function($sce){ // {{url_prefix | trustUrl : url}}
    return function(url_prefix, url) {
        return $sce.trustAsResourceUrl(url_prefix + url);
    };
});
