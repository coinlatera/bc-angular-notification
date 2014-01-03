angular.module('bc.notifications-UI', []).service "Notifications", ['$rootScope', ($rootScope) ->
  
  # Define if the notification need to be displayed
  $rootScope.notificationsPaused = false


  # Pause the notification display
  this.pause = ->
    $rootScope.notificationsPaused = true

  # Resume the notification display
  this.resume = ->
    $rootScope.notificationsPaused = false
 
]
