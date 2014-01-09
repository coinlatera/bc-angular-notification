angular.module('bc.notifications', []).service "Notifications", ['$rootScope', ($rootScope) ->
  
  # We store all the notifications in the root scope
  $rootScope.notifications = []


  # Return all the notifications without any filtering
  this.all = ->
    return $rootScope.notifications


  # Return all the unread notifications (with the flag `read` to false)
  this.unread = () ->
    unread = []
    for notification in $rootScope.notifications
      unless notification.read
        unread.push notification
    return unread


  # Return all the notifications that have been already read
  # (with the flag `read` to true)
  this.read = () ->
    read = []
    for notification in $rootScope.notifications
      if notification.read
        read.push notification
    return read


  # Set the flag `read` to true for every notification
  this.markAllAsRead = () ->
    for notification in $rootScope.notifications
      notification.read = true
    return


  # Set the flag `read` to true for the corresponding notification
  this.markAsRead = (notification) ->
    for notif in $rootScope.notifications
      if notif.id is notification.id
        notif.read = true


  # Remove a notification from the notification array
  this.remove = (notifId) ->
    i = 0
    while (i < $rootScope.notifications.length)
      if $rootScope.notifications[i].id is notification.id
        $rootScope.notifications.splice(i, 1)
      i++


  # Remove all notifications from the notification array
  this.removeAll = () ->
    $rootScope.notifications = []


  # Add a new notification to the notifications array
  this.show = (notification) ->
    $rootScope.notifications.push notification
    return
 
]
