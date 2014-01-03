'use strict';

angular.module('buttercoinAngularNotificationTestApp', ['bc.angular-notification'])
                 .config(['$provide', function ($provide) {
                   $provide.constant('CONFIG', { locale: 'fr_FR' });
                   $provide.constant('Strings', {
                      'known_english_translation': {
                        'en_US': 'We sent you another code via SMS [link url=#/notifications/_$id_]Learn more[/link]',
                        'fr_FR': 'Nous vous avons envoyé un nouveau code par SMS [link url=#/notifications/_$id_]En savoir plus[/link]'
                      },
                     'no_french_translation': {
                       'en_US': 'I am the English-only version of the target string',
                     }
                   });
                 }])
                 .controller('MainCtrl', function ($scope, Notifications, NotificationsBuilder, NotificationsUI) {

  var getNotification = function (title, type, displayMode, duration, urgent) {
    return NotificationsBuilder.buildNotification(type, title, '', displayMode, urgent, false, {}, duration);
  };

  var counter = 0;

  $scope.showRandomNotif = function (displayMode, duration, urgent) {
    if (displayMode === 'sticky') {
      Notifications.show(getNotification('This is the sticky notification no ' + (++counter) + '. It won\'t go away until the user dismiss it' , 'urgent', 'sticky'));
    }
    else if (displayMode === 'active') {
      var type = Math.floor(Math.random() * 3) % 3;
      type = type == 0 ? 'success' : type == 1 ? 'pending' : 'error';
      var titleNo = Math.floor(Math.random() * 3) % 3;
      var title = titleNo == 0 ? "Hey there!" : type == 1 ? ('This is the ' + type + ' notification no ' + (++counter)) : ('This is the ' + type + ' notification no ' + (++counter) + '. It will automatically disappear after a certain amount of time.');
      Notifications.show(getNotification(title, type, 'active', duration, urgent));
    }
    else if (displayMode === 'banana') {
      Notifications.show(getNotification('<img src="dancing-banana.gif"/><br/>Yup, you can even put gif in notifications!', 'info', 'active'));
    }
  };

  $scope.showLocalizedNotif = function (key) {
    Notifications.show(NotificationsBuilder.buildNotification('success', key, '', 'active', false, false, {i: 23}));
  };

  $scope.emptyQueue = function () {
    Notifications.markAllAsRead();
  };

  $scope.pause = function () {
    NotificationsUI.pause();
  }

  $scope.resume = function () {
    NotificationsUI.resume();
  }

});
