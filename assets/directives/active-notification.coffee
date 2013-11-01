define ['app'], (app) ->
  app.directive 'activeNotification', (Notifications, $timeout) ->
    restrict: 'E',
    template: '<div ng-show="showNotification" class="urgent-notification active" ng-class="className">' +
                '<span ng-bind-html-unsafe="title"></span>' +
                '<div class="close"><i class="icon-remove-circle icon-large"></i></div>' +
              '</div>',
    link: (scope, element, attrs) ->

      # Hide the notification at start
      scope.showNotification = false

      # Initialise and display a notification
      displayNotification = (notification) ->

        # Bind the notification with the template model
        scope.notification = angular.copy(notification)
        scope.title = notification.title
        scope.className = colorForType notification.type
        unless scope.$$phase
          scope.$apply()

        # Animate the notification apparition
        notificationElement = $(element[0]).find('.urgent-notification')
        notificationElement.css {
          display: 'block',
          top: -100
        }
        notificationElement.animate {
          top: 25
        }, 'slow', () ->
          $timeout ->
            dismissNotification()
          , 3000

      dismissing = false;

      dismissNotification = ->
        if !dismissing
          dismissing = true
          Notifications.markAsRead(scope.notification)
          $(element[0]).find('.urgent-notification').fadeOut 'slow', findNewNotification


      # Bind the click on the close button
      $(element[0]).find('.close').bind 'click', () ->
        dismissNotification()

      # Get the color class for a specific type
      colorForType = (type) ->
        if type is 'error' or type is 'urgent'
          return 'orange'
        else if type is 'pending' or type is 'info'
          return 'blue'
        else if type is 'success'
          return 'green'
        else
          return 'blue'



      # Look for a new notification to display in the notifications pool
      findNewNotification = () ->
        dismissing = false
        for notification in scope.allNotifications
          unless notification.read
            if notification.display is 'active'
              if scope.notification? and notification.id is scope.notification.id
                continue
              displayNotification notification



      # Watch for a change in the notification pool
      scope.$watch 'allNotifications', (newValue, oldValue) ->
        unless newValue is oldValue
          # Every time something change, we update the notification
          findNewNotification()
      , true



      # We get all the notifications
      scope.allNotifications = Notifications.all()
      findNewNotification()