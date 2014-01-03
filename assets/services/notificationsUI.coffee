angular.module('bc.notifications-ui', []).service "NotificationsUI", ['$rootScope', ($rootScope) ->
  
  # Define if the notification need to be displayed
  $rootScope.state = 
    paused: false


  # Pause the notification display
  this.pause = ->
    $rootScope.state.paused = true

  # Resume the notification display
  this.resume = ->
    $rootScope.state.paused = false

  # Return the notifications state
  this.state = () ->
    return $rootScope.state
 
]
