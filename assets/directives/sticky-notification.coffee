angular.module('bc.sticky-notification', []).directive 'stickyNotification', ['Notifications', '$rootScope', '$timeout', (Notifications, $rootScope, $timeout) ->
  restrict: 'E',
  scope:
    stickyNotifications: "&"
  template: '<div ng-repeat="notif in stickyNotifications" id="notif-{{notif.general.id}}" class="urgent-notification sticky" ng-class="colorForType(notif.display.type)">' +
              '<span ng-bind-html-unsafe="notif.content.message"></span>' +
              '<div class="close" ng-click="close(notif)"><i class="icon-remove-circle icon-large"></i></div>' +
            '</div>',
  link: (scope, element, attrs) ->


    # Click on the close button
    scope.close = (notif) ->
      # Mark the notification as read
      Notifications.markAsRead(notif)



    # Get the color class for a specific type
    scope.colorForType = (type) ->
      if type is 'error' or type is 'urgent'
        return 'orange'
      else if type is 'pending' or type is 'info'
        return 'blue'
      else if type is 'success'
        return 'green'
      else
        return 'blue'



    # Watch for a change in the notification pool
    $rootScope.$watch 'notifications', (newValue, oldValue) ->
      unless newValue is oldValue
        updateNotifications(newValue)
    , true

    updateNotifications = (pool) ->
      # Every time something change, we update the notification
      scope.stickyNotifications = []
      for notif in pool
        if not notif.general.read and notif.display.mode is 'sticky' and notif.display.location is attrs.id
          scope.stickyNotifications.push notif
      return

    updateNotifications($rootScope.notifications)

]
