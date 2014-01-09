'use strict';

app.controller('MainCtrl', function ($scope, Notifications, NotificationsBuilder, NotificationsUI) {

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
