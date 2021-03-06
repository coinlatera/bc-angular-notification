(function() {
  angular.module('bc.angular-notification', ['bc.notifications', 'bc.notifications-builder', 'bc.notifications-ui', 'bc.active-notification', 'bc.sticky-notification']);

}).call(this);

(function() {
  angular.module('bc.active-notification', ['SafeApply']).directive('activeNotification', [
    'Notifications', 'NotificationsUI', '$timeout', '$rootScope', '$sce', function(Notifications, NotificationsUI, $timeout, $rootScope, $sce) {
      return {
        restrict: 'E',
        template: '<div ng-show="showNotification" class="urgent-notification active" ng-class="className">' + '<span ng-bind-html="message"></span>' + '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' + '</div>',
        link: function(scope, element, attrs) {
          var colorForType, dismissNotification, dismissing, displayNotification, findNewNotification;
          scope.showNotification = false;
          dismissing = false;
          displayNotification = function(notification) {
            var notificationElement;
            scope.watchedCopy = notification;
            scope.$watch('watchedCopy', function(value) {
              if (value.general.read) {
                return dismissNotification(value.general.id, true, findNewNotification);
              }
            }, true);
            if (!dismissing) {
              scope.notification = angular.copy(notification);
              scope.message = $sce.trustAsHtml(notification.content.message);
              scope.className = colorForType(notification.display.type);
              if (notification.display.customClass !== '') {
                scope.className += ' ' + notification.display.customClass;
              }
              $rootScope.$safeApply();
              scope.showNotification = true;
              notificationElement = $(element[0]).find('.urgent-notification');
              notificationElement.css({
                display: 'block',
                top: -100
              });
              return notificationElement.animate({
                top: 68
              }, 'slow', function() {
                var bodyClick, displayDuration;
                displayDuration = notification.display.duration != null ? notification.display.duration : 2000 + notification.content.message.length * 80;
                if (displayDuration !== -1) {
                  return $timeout(function() {
                    return dismissNotification(notification.general.id, true, findNewNotification);
                  }, displayDuration);
                } else {
                  bodyClick = function() {
                    $('body').unbind('click', bodyClick);
                    return dismissNotification(notification.general.id, true, findNewNotification);
                  };
                  return $('body').bind('click', bodyClick);
                }
              });
            }
          };
          dismissNotification = function(id, markAsRead, callback) {
            if (!dismissing && (scope.notification != null) && scope.notification.general.id === id) {
              dismissing = true;
              if (markAsRead) {
                Notifications.markAsRead(scope.notification);
                scope.notification.general.read = true;
              }
              delete scope.notification;
              return $(element[0]).find('.urgent-notification').fadeOut('slow', callback);
            }
          };
          $(element[0]).find('.close').bind('click', function() {
            return dismissNotification(scope.notification.general.id, true, findNewNotification);
          });
          colorForType = function(type) {
            if (type === 'error') {
              return 'orange';
            } else if (type === 'info') {
              return 'blue';
            } else if (type === 'success') {
              return 'green';
            } else {
              return '';
            }
          };
          findNewNotification = function() {
            var notification, _i, _len, _ref, _results;
            dismissing = false;
            if (scope.notification == null) {
              _ref = Notifications.all();
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                notification = _ref[_i];
                if (!(notification.general.read || (scope.state.paused && !notification.display.urgent))) {
                  if (notification.display.mode === 'active') {
                    if ((scope.notification == null) || scope.notification.general.read) {
                      displayNotification(notification);
                      break;
                    } else {
                      _results.push(void 0);
                    }
                  } else {
                    _results.push(void 0);
                  }
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          };
          $rootScope.$watch('notifications', function(newValue, oldValue) {
            if (!(newValue === oldValue || dismissing)) {
              return findNewNotification();
            }
          }, true);
          scope.state = NotificationsUI.state();
          scope.$watch('state', function(newValue, oldValue) {
            if ((newValue != null) && (newValue.paused != null) && ((oldValue == null) || (oldValue.paused == null) || newValue.paused !== oldValue.paused)) {
              if (scope.state.paused && (scope.notification != null) && !scope.notification.display.urgent && !dismissing) {
                return dismissNotification(scope.notification.general.id, false, findNewNotification);
              } else if (!dismissing) {
                return findNewNotification();
              }
            }
          }, true);
          return findNewNotification();
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.sticky-notification', ['ngAnimate', 'SafeApply']).directive('stickyNotification', [
    'Notifications', '$rootScope', '$sce', function(Notifications, $rootScope, $sce) {
      return {
        restrict: 'E',
        scope: {
          stickyNotifications: '&'
        },
        template: '<div class="sticky-notifications">' + '<div ng-repeat="notif in stickyNotifications" id="notif-{{notif.general.id}}" class="urgent-notification sticky anim-fade anim-slide" ng-class="colorForType(notif.display.type)">' + '<span ng-bind-html="getTrustedHtml(notif.content.message)"></span>' + '<div class="close" ng-click="close(notif)"><i class="icon-remove-circle icon-large"></i></div>' + '</div>' + '</div>',
        link: function(scope, element, attrs) {
          var updateNotifications;
          scope.close = function(notif) {
            Notifications.markAsRead(notif);
            updateNotifications();
          };
          $('body').bind('click', function() {
            var didSomething, i, notif, _i, _len, _ref;
            didSomething = false;
            _ref = scope.stickyNotifications;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              notif = _ref[i];
              if (!notif.display.permanent && (new Date().getTime() - notif.general.displayTime > 100)) {
                Notifications.markAsRead(notif);
                didSomething = true;
              }
            }
            if (didSomething) {
              updateNotifications();
              $rootScope.$safeApply();
            }
            return true;
          });
          scope.colorForType = function(type) {
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
          scope.getTrustedHtml = function(value) {
            return $sce.trustAsHtml(value);
          };
          $rootScope.$watch('notifications.length', function() {
            updateNotifications();
          });
          updateNotifications = function() {
            var notif, _i, _len, _ref;
            scope.stickyNotifications = [];
            _ref = $rootScope.notifications;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              notif = _ref[_i];
              if (!notif.general.read && notif.display.mode === 'sticky' && notif.display.location === attrs.id) {
                if (notif.general.displayTime === 0) {
                  notif.general.displayTime = new Date().getTime();
                }
                scope.stickyNotifications.push(notif);
              }
            }
          };
          return updateNotifications($rootScope.notifications);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.notifications', []).service('Notifications', [
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
          if (!notification.general.read) {
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
          if (notification.general.read) {
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
          notification.general.read = true;
        }
      };
      this.markAsRead = function(notification) {
        var notif, _i, _len, _ref;
        _ref = $rootScope.notifications;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          notif = _ref[_i];
          if (notif.general.id === notification.general.id) {
            notif.general.read = true;
          }
        }
      };
      this.remove = function(notification) {
        var i, notif, _i, _len, _ref;
        _ref = $rootScope.notifications;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          notif = _ref[i];
          if (notif.general.id === notification.general.id) {
            $rootScope.notifications.splice(i, 1);
          }
        }
      };
      this.removeAll = function() {
        $rootScope.notifications = [];
      };
      this.show = function(notification) {
        $rootScope.notifications.push(notification);
      };
      return this;
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
        message = message.replace(/\[link\]([^\[]*)\[\/link\]/, '<a class="notif-link">$1</a>');
        message = message.replace(/\[button\]([^\[]*)\[\/button\]/, '<a class="btn btn-primary notif-button">$1</a>');
        message = message.replace(/[^\\]_([a-zA-Z0-9\$]+)_/g, function(text, key) {
          return text[0] + params[key];
        });
        message = message.replace(/^_([a-zA-Z0-9\$]+)_/g, function(text, key) {
          return params[key];
        });
        message = message.replace(/\\_/g, function(text) {
          return '_';
        });
        message = message.replace(/\[link url=([^\]]*)\]([^\[]*)\[\/link\]/, '<a class="notif-link" href="$1">$2</a>');
        message = message.replace(/\[button url=([^\]]*)\]([^\[]*)\[\/button\]/, '<a class="btn btn-primary notif-button" href="$1">$2</a>');
        return message;
      };
      this.buildNotification = function(notification) {
        notification = $.extend(true, this.defaults(), notification);
        notification.content.message = postProcessMessage($filter('translate')(notification.content.message, true), notification.content.params);
        notification.content.details = postProcessMessage($filter('translate')(notification.content.details, true), notification.content.params);
        return notification;
      };
      this.defaults = function() {
        var id;
        id = Math.floor(Math.random() * 999999);
        return {
          general: {
            id: id,
            date: new Date().getTime(),
            read: false,
            displayTime: 0
          },
          content: {
            message: '',
            details: '',
            params: {
              id: id
            }
          },
          display: {
            mode: 'silent',
            location: '',
            permanent: false,
            urgent: false,
            type: 'success',
            dropdown: false,
            duration: null,
            customClass: ''
          }
        };
      };
      return this;
    }
  ]);

}).call(this);

(function() {
  angular.module('bc.notifications-ui', []).service('NotificationsUI', [
    '$rootScope', function($rootScope) {
      $rootScope.state = {
        paused: false
      };
      this.pause = function() {
        $rootScope.state.paused = true;
      };
      this.resume = function() {
        $rootScope.state.paused = false;
      };
      this.state = function() {
        return $rootScope.state;
      };
      return this;
    }
  ]);

}).call(this);
