'use strict';

angular.module('buttercoinAngularNotificationTestApp', ['bc.angular-notification'])
.controller('MainCtrl', function ($scope, Notifications) {

  var getNotification = function (title, type, displayMode) {
    return {
      id: Math.floor(Math.random() * 999999),
      title: title,
      read: false,
      type: type,
      display: displayMode
    };
  };

  var counter = 0;

  $scope.showRandomNotif = function (displayMode) {
    if (displayMode === 'sticky') {
      Notifications.show(getNotification('This is the sticky notification no ' + (++counter) + '. It won\'t go away until the user dismiss it' , 'urgent', 'sticky'));
    }
    else if (displayMode === 'active') {
      var type = Math.floor(Math.random() * 3) % 3;
      type = type == 0 ? 'success' : type == 1 ? 'pending' : 'info';
      Notifications.show(getNotification('This is the ' + type + ' notification no ' + (++counter) + '. It will automatically disappear after a certain amount of time.', type, 'active'));
    }
    else if (displayMode === 'banana') {
      Notifications.show(getNotification('<img src="dancing-banana.gif"/><br/>Yup, you can even put gif in notifications!', 'info', 'active'));
    }
  }

  $scope.showNotif = function () {
    Notifications.show(getNotification('Test', 'urgent', 'sticky')); // pending, info, sticky
    Notifications.show(getNotification('Test', 'success', 'active')); // pending, info, sticky
  };


});