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



    # # Look for a new notification to display in the notifications pool
    # findNewNotification = () ->
    #   for notification in scope.allNotifications
    #     unless notification.read
    #       if notification.display is 'sticky' and notification.type is 'urgent'
    #         if scope.notification? and notification.id is scope.notification.id
    #           continue
    #         displayNotification notification



    # Watch for a change in the notification pool
    scope.stickyNotifications = []
    $rootScope.$watch 'notifications', (newValue, oldValue) ->
      unless newValue is oldValue
        # Every time something change, we update the notification
        scope.stickyNotifications = []
        for notif in newValue
          if not notif.general.read and notif.display.mode is 'sticky' and notif.display.location is attrs.id
            scope.stickyNotifications.push notif
        return
    , true

    # findNewNotification()

]
