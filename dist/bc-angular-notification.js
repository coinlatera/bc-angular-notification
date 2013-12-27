(function() {
  angular.module('bc.angular-notification', ['bc.notifications', 'bc.notifications-builder', 'bc.active-notification', 'bc.sticky-notification']);

}).call(this);

(function() {
  angular.module('bc.active-notification', []).directive('activeNotification', [
    'Notifications', '$timeout', function(Notifications, $timeout) {
      return {
        restrict: 'E',
        template: '<div ng-show="showNotification" class="urgent-notification active" ng-class="className">' + '<span ng-bind-html-unsafe="title"></span>' + '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' + '</div>',
        link: function(scope, element, attrs) {
          var colorForType, dismissNotification, dismissing, displayNotification, findNewNotification;
          scope.showNotification = false;
          dismissing = false;
          displayNotification = function(notification) {
            var notificationElement;
            scope.watchedCopy = notification;
            scope.$watch('watchedCopy', function(value) {
              if (value.read) {
                return dismissNotification(value.id, true, findNewNotification);
              }
            }, true);
            if (!dismissing) {
              scope.notification = angular.copy(notification);
              scope.title = notification.title;
              scope.className = colorForType(notification.type);
              if (notification.customClass != null) {
                scope.className += ' ' + notification.customClass;
              }
              if (!scope.$$phase) {
                scope.$apply();
              }
              notificationElement = $(element[0]).find('.urgent-notification');
              notificationElement.css({
                display: 'block',
                top: -100
              });
              return notificationElement.animate({
                top: 68
              }, 'slow', function() {
                var displayDuration;
                displayDuration = notification.duration != null ? notification.duration : 2000 + notification.title.length * 80;
                if (displayDuration !== -1) {
                  return $timeout(function() {
                    return dismissNotification(notification.id, true, findNewNotification);
                  }, displayDuration);
                }
              });
            }
          };
          dismissNotification = function(id, markAsRead, callback) {
            if (!dismissing && scope.notification.id === id) {
              dismissing = true;
              if (markAsRead) {
                Notifications.markAsRead(scope.notification);
              }
              return $(element[0]).find('.urgent-notification').fadeOut('slow', callback);
            }
          };
          $(element[0]).find('.close').bind('click', function() {
            return dismissNotification(scope.notification.id, true, findNewNotification);
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
                  if ((scope.notification == null) || scope.notification.read) {
                    _results.push(displayNotification(notification));
                  } else {
                    dismissNotification(scope.notification.id, false, function() {
                      dismissing = false;
                      return displayNotification(notification);
                    });
                    break;
                  }
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
            if (!(newValue === oldValue || dismissing)) {
              return findNewNotification();
            }
          }, true);
          scope.allNotifications = Notifications.all();
          return findNewNotification();
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.sticky-notification', []).directive('stickyNotification', [
    'Notifications', function(Notifications) {
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
              if (notification.customClass != null) {
                scope.className += ' ' + notification.customClass;
              }
              if (!scope.$$phase) {
                scope.$apply();
              }
              scope.$watch('notification', function(value) {
                if (value.read) {
                  return $(element[0]).find('.urgent-notification').slideUp('slow', 'linear', findNewNotification);
                }
              }, true);
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
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.notifications', []).service("Notifications", [
    '$rootScope', function($rootScope) {
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
          if (notif.id === notification.id || (notif.category === notification.category && notif.indexInCategory <= notification.indexInCategory)) {
            _results.push(notif.read = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      return this.show = function(notification) {
        $rootScope.notifications.unshift(notification);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.notifications-builder', ['bc.angular-i18n']).service('NotificationsBuilder', [
    '$filter', function($filter) {
      var postProcessMessage;
      postProcessMessage = function(message, params) {
        message = message.replace(/\[blue\]([^\[]*)\[\/blue\]/, '<span class="notif-blue">$1</span>');
        message = message.replace(/\[green\]([^\[]*)\[\/green\]/, '<span class="notif-green">$1</span>');
        message = message.replace(/\[red\]([^\[]*)\[\/red\]/, '<span class="notif-red">$1</span>');
        message = message.replace(/\[button\]([^\[]*)\[\/button\]/, '<a class="notif-link">$1</a>');
        message = message.replace(/[^\\]_([a-zA-Z0-9]+)_/g, function(text, key) {
          return text[0] + params[key];
        });
        message = message.replace(/^_([a-zA-Z0-9]+)_/g, function(text, key) {
          return params[key];
        });
        message = message.replace(/\\_/g, function(text) {
          return '_';
        });
        message = message.replace(/\[button url=([^\]]*)\]([^\[]*)\[\/button\]/, '<a class="notif-link" href="$1">$2</a>');
        return message;
      };
      return {
        buildNotification: function(type, message, displayMode, showInDropdown, params, category, indexInCategory, duration) {
          if (params == null) {
            params = {};
          }
          return {
            id: Math.floor(Math.random() * 999999),
            title: postProcessMessage($filter('translate')(message, true), params),
            description: '',
            read: false,
            type: type,
            display: displayMode,
            date: new Date().getTime(),
            showInDropdown: showInDropdown,
            button: {
              url: '',
              title: ''
            },
            category: category,
            indexInCategory: indexInCategory,
            customClass: params['customClass'] ? params['customClass'] : '',
            duration: duration
          };
        }
      };
    }
  ]);

}).call(this);
