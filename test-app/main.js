'use strict';

angular.module('buttercoinAngularNotificationTestApp', ['bc.angular-notification'])
.controller('MainCtrl', function ($scope, Notifications, $rootScope) {

  var getNotification = function (title, type, displayMode) {
    return {
      id: Math.floor(Math.random() * 999999),
      title: title,
      read: false,
      type: type,
      display: displayMode
    };
  };

  $scope.showNotification = function () {
    Notifications.show(getNotification('Test', 'success', 'active')); // pending, info, sticky
  }


});