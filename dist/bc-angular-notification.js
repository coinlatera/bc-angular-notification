(function() {
  angular.module('bc.angular-notification', ['bc.notification', 'bc.active-notification', 'bc.sticky-notification']);

}).call(this);

(function() {
  angular.module('bc.active-notification', []).directive('activeNotification', function(Notifications, $timeout) {
    return {
      restrict: 'E',
      template: '<div ng-show="showNotification" class="urgent-notification active" ng-class="className">' + '<span ng-bind-html-unsafe="title"></span>' + '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' + '</div>',
      link: function(scope, element, attrs) {
        var colorForType, dismissNotification, dismissing, displayNotification, findNewNotification;
        scope.showNotification = false;
        displayNotification = function(notification) {
          var notificationElement;
          scope.notification = angular.copy(notification);
          scope.title = notification.title;
          scope.className = colorForType(notification.type);
          if (!scope.$$phase) {
            scope.$apply();
          }
          notificationElement = $(element[0]).find('.urgent-notification');
          notificationElement.css({
            display: 'block',
            top: -100
          });
          return notificationElement.animate({
            top: 25
          }, 'slow', function() {
            return $timeout(function() {
              return dismissNotification();
            }, 3000);
          });
        };
        dismissing = false;
        dismissNotification = function() {
          if (!dismissing) {
            dismissing = true;
            Notifications.markAsRead(scope.notification);
            return $(element[0]).find('.urgent-notification').fadeOut('slow', findNewNotification);
          }
        };
        $(element[0]).find('.close').bind('click', function() {
          return dismissNotification();
        });
        colorForType = function(type) {
          if (type === 'error' || type === 'urgent') {
            return 'orange';
          } else if (type === 'pending' || type === 'info') {
            return 'blue';
          } else if (type === 'success') {
            return 'green';
          } else {
            return 'blue';
          }
        };
        findNewNotification = function() {
          var notification, _i, _len, _ref, _results;
          dismissing = false;
          _ref = scope.allNotifications;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            notification = _ref[_i];
            if (!notification.read) {
              if (notification.display === 'active') {
                if ((scope.notification != null) && notification.id === scope.notification.id) {
                  continue;
                }
                _results.push(displayNotification(notification));
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        scope.$watch('allNotifications', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return findNewNotification();
          }
        }, true);
        scope.allNotifications = Notifications.all();
        return findNewNotification();
      }
    };
  });

}).call(this);

(function() {
  angular.module('bc.sticky-notification', []).directive('stickyNotification', function(Notifications) {
    return {
      restrict: 'E',
      template: '<div ng-show="showNotification" class="urgent-notification sticky" ng-class="className">' + '<span ng-bind-html-unsafe="title"></span>' + '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' + '</div>',
      link: function(scope, element, attrs) {
        var colorForType, displayNotification, findNewNotification;
        scope.showNotification = false;
        displayNotification = function(notification) {
          return $(element[0]).find('.urgent-notification').slideUp('slow', 'linear', function() {
            scope.notification = notification;
            scope.title = notification.title;
            scope.className = colorForType(notification.type);
            if (!scope.$$phase) {
              scope.$apply();
            }
            return $(element[0]).find('.urgent-notification').slideDown('slow', 'linear');
          });
        };
        $(element[0]).find('.close').bind('click', function() {
          Notifications.markAsRead(scope.notification);
          return $(element[0]).find('.urgent-notification').slideUp('slow', 'linear', findNewNotification);
        });
        colorForType = function(type) {
          if (type === 'error' || type === 'urgent') {
            return 'orange';
          } else if (type === 'pending' || type === 'info') {
            return 'blue';
          } else if (type === 'success') {
            return 'green';
          } else {
            return 'blue';
          }
        };
        findNewNotification = function() {
          var notification, _i, _len, _ref, _results;
          _ref = scope.allNotifications;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            notification = _ref[_i];
            if (!notification.read) {
              if (notification.display === 'sticky' && notification.type === 'urgent') {
                if ((scope.notification != null) && notification.id === scope.notification.id) {
                  continue;
                }
                _results.push(displayNotification(notification));
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        scope.$watch('allNotifications', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            return findNewNotification();
          }
        }, true);
        scope.allNotifications = Notifications.all();
        return findNewNotification();
      }
    };
  });

}).call(this);

(function() {
  angular.module('bc.active-notification', []).service("Notifications", function($rootScope) {
    $rootScope.notifications = [];
    this.all = function() {
      return $rootScope.notifications;
    };
    this.unread = function() {
      var notification, unread, _i, _len, _ref;
      unread = [];
      _ref = $rootScope.notifications;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        if (!notification.read) {
          unread.push(notification);
        }
      }
      return unread;
    };
    this.read = function() {
      var notification, read, _i, _len, _ref;
      read = [];
      _ref = $rootScope.notifications;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        if (notification.read) {
          read.push(notification);
        }
      }
      return read;
    };
    this.markAllAsRead = function() {
      var notification, _i, _len, _ref;
      _ref = $rootScope.notifications;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notification = _ref[_i];
        notification.read = true;
      }
    };
    this.markAsRead = function(notification) {
      var notif, _i, _len, _ref, _results;
      _ref = $rootScope.notifications;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        notif = _ref[_i];
        if (notif.id === notification.id) {
          _results.push(notif.read = true);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    this.show = function(notification) {
      $rootScope.notifications.unshift(notification);
    };
  });

  return;

}).call(this);
