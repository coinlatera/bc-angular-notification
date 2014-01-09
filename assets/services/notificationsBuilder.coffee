angular.module('bc.notifications-builder', ['bc.angular-i18n']).service 'NotificationsBuilder', ['$filter', ($filter) ->

  postProcessMessage = (message, params) ->
    message = message.replace /\[blue\]([^\[]*)\[\/blue\]/, '<span class="notif-blue">$1</span>'
    message = message.replace /\[green\]([^\[]*)\[\/green\]/, '<span class="notif-green">$1</span>'
    message = message.replace /\[red\]([^\[]*)\[\/red\]/, '<span class="notif-red">$1</span>'
    message = message.replace /\[link\]([^\[]*)\[\/link\]/, '<a class="notif-link">$1</a>'
    message = message.replace /\[button\]([^\[]*)\[\/button\]/, '<a class="btn btn-primary notif-button">$1</a>'
    message = message.replace /[^\\]_([a-zA-Z0-9\$]+)_/g, (text, key) -> text[0] + params[key]
    message = message.replace /^_([a-zA-Z0-9\$]+)_/g, (text, key) -> params[key]
    message = message.replace /\\_/g, (text) -> '_'
    message = message.replace /\[link url=([^\]]*)\]([^\[]*)\[\/link\]/, '<a class="notif-link" href="$1">$2</a>'
    message = message.replace /\[button url=([^\]]*)\]([^\[]*)\[\/button\]/, '<a class="btn btn-primary notif-button" href="$1">$2</a>'
    return message


  this.buildNotification = (notification) ->
    notification = $.extend true, this.defaults(), notification
    notification.content.message = postProcessMessage($filter('translate')(notification.content.message, true), notification.content.params)
    notification.content.details = postProcessMessage($filter('translate')(notification.content.details, true), notification.content.params)
    return notification


  this.defaults = () ->
    id = Math.floor Math.random() * 999999
    general:
      id: id                     # id of the notification
      date: new Date().getTime() # date of the notification
      read: false                # defines if the notification has been read
    content:
      message: ''                # message to display when the notification is shown
      details: ''                # additional detail to the message to display in the notifications page
      params:                    # parameters to customize the notification message
        id: id
    display:
      mode: 'silent'             # 'silent', 'active' or 'sticky'
      location: ''               # id of the directive where to display the notification (only used for 'sticky' mode)
      urgent: false              # define if the notification should be shown even if the NotificationsUI has been paused
      type: 'success'            # 'success', 'info' or 'error'
      dropdown: false            # defines if the notification should be displayed in the dropdown and notifications page
      duration: null             # `null`, `positive integer` or -1
      customClass: ''            # custom class to apply to the notification when shown

  return this
  
]

