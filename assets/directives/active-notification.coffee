angular.module('bc.active-notification', []).directive 'activeNotification', ['Notifications', 'NotificationsUI', '$timeout', '$rootScope', '$sce', (Notifications, NotificationsUI, $timeout, $rootScope, $sce) ->
  restrict: 'E',
  template: '<div ng-show="showNotification" class="urgent-notification active" ng-class="className">' +
              '<span ng-bind-html="message"></span>' +
              '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' +
            '</div>',
  link: (scope, element, attrs) ->

    # Hide the notification at start
    scope.showNotification = false
    dismissing = false

    # Initialise and display a notification
    displayNotification = (notification) ->

      # Watch for the read attribute to force notification dismiss
      scope.watchedCopy = notification
      scope.$watch 'watchedCopy', (value) ->
        dismissNotification value.general.id, true, findNewNotification if value.general.read
      , true

      unless dismissing
        # Bind the notification with the template model
        scope.notification = angular.copy(notification)
        scope.message = $sce.trustAsHtml notification.content.message
        scope.className = colorForType notification.display.type
        if notification.display.customClass isnt ''
          scope.className += ' ' + notification.display.customClass
        unless scope.$$phase
          scope.$apply()

        # Animate the notification apparition
        scope.showNotification = true
        notificationElement = $(element[0]).find('.urgent-notification')
        notificationElement.css {
          display: 'block',
          top: -100
        }
        notificationElement.animate {
          top: 68
        }, 'slow', () ->
          displayDuration = if notification.display.duration? then notification.display.duration else (2000 + notification.content.message.length * 80)
          if displayDuration isnt -1
            $timeout ->
              dismissNotification notification.general.id, true, findNewNotification
            , displayDuration
          else
            bodyClick = () ->
              $('body').unbind 'click', bodyClick
              dismissNotification notification.general.id, true, findNewNotification
            $('body').bind 'click', bodyClick


    dismissNotification = (id, markAsRead, callback) ->
      if not dismissing and scope.notification? and scope.notification.general.id is id
        dismissing = true
        if markAsRead
          Notifications.markAsRead(scope.notification)
          scope.notification.general.read = true
        delete scope.notification
        $(element[0]).find('.urgent-notification').fadeOut 'slow', callback


    # Bind the click on the close button
    $(element[0]).find('.close').bind 'click', () ->
      dismissNotification scope.notification.general.id, true, findNewNotification


    # Get the color class for a specific type
    colorForType = (type) ->
      if type is 'error'
        return 'orange'
      else if type is 'info'
        return 'blue'
      else if type is 'success'
        return 'green'
      else
        return ''


    # Look for a new notification to display in the notifications pool
    findNewNotification = () ->
      dismissing = false
      unless scope.notification?
        for notification in Notifications.all()
          unless notification.general.read or (scope.state.paused and not notification.display.urgent)
            if notification.display.mode is 'active'
              if (not scope.notification?) or scope.notification.general.read
                displayNotification notification
                break


    # Watch for a change in the notification pool
    $rootScope.$watch 'notifications', (newValue, oldValue) ->
      unless newValue is oldValue or dismissing
        # Every time something change, we update the notification
        findNewNotification()
    , true

    # Watch for a change in the NotificationUI service
    scope.state = NotificationsUI.state()
    scope.$watch 'state', (newValue, oldValue) ->
      # Check for a real change
      if newValue? and newValue.paused? and (not oldValue? or not oldValue.paused? or newValue.paused isnt oldValue.paused)
        # If we just paused and we are not displaying a urgent notification
        # or dismissing it, we dismiss it
        if scope.state.paused and scope.notification? and not scope.notification.display.urgent and not dismissing
          dismissNotification scope.notification.general.id, false, findNewNotification
        # Refresh the notification
        else if not dismissing
          findNewNotification()
    , true


    # We get all the notifications
    findNewNotification()
]
