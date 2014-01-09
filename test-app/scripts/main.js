'use strict';

app.controller('MainCtrl', function ($scope, Notifications, NotificationsBuilder, NotificationsUI) {

  $scope.showActiveNotif = function (type) {
    Notifications.show(NotificationsBuilder.buildNotification({
      content: {
        message: 'Active notification'
      },
      display: {
        type: type,
        mode: 'active'
      }
    }));
  }

  $scope.showStickyNotif = function (type, location) {
    Notifications.show(NotificationsBuilder.buildNotification({
      content: {
        message: 'Active notification'
      },
      display: {
        type: type,
        mode: 'sticky',
        location: location
      }
    }));
  }

});
