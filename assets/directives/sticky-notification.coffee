angular.module('bc.sticky-notification', []).directive 'stickyNotification', ['Notifications', '$rootScope', '$sce', (Notifications, $rootScope, $sce) ->
  restrict: 'E',
  scope:
    stickyNotifications: '&'
  template: '<div ng-repeat="notif in stickyNotifications" id="notif-{{notif.general.id}}" class="urgent-notification sticky" ng-class="colorForType(notif.display.type)">' +
              '<span ng-bind-html="getTrustedHtml(notif.content.message)"></span>' +
              '<div class="close" ng-click="close(notif)"><i class="icon-remove-circle icon-large"></i></div>' +
            '</div>',
  link: (scope, element, attrs) ->


    # Click on the close button
    scope.close = (notif) ->
      # Mark the notification as read
      Notifications.markAsRead(notif)
      return

    $('body').bind 'click', () ->
      for notif, i in scope.stickyNotifications
        displayTime = scope.displayTimes[i]
        if not notif.display.permanent and (new Date().getTime() - displayTime > 100)
          Notifications.markAsRead notif
      scope.$apply()
      return


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


    # Return the value as trusted HTML
    scope.getTrustedHtml = (value) ->
      return $sce.trustAsHtml value


    # Watch for a change in the notification pool
    $rootScope.$watch 'notifications', (newValue, oldValue) ->
      unless newValue is oldValue
        updateNotifications(newValue)
      return
    , true

    updateNotifications = (pool) ->
      # Every time something change, we update the notification
      scope.stickyNotifications = []
      scope.displayTimes = []
      for notif in pool
        if not notif.general.read and notif.display.mode is 'sticky' and notif.display.location is attrs.id
          scope.displayTimes.push new Date().getTime()
          scope.stickyNotifications.push notif
      return

    updateNotifications($rootScope.notifications)

]
