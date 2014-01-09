angular.module('bc.notifications-builder', ['bc.angular-i18n']).service 'NotificationsBuilder', ['$filter', ($filter) ->

  buildNotification: (notification) ->
    notification = $.extend true, this.defaults(), notification



  defaults: () ->
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
      type: 'success'            # 'success', 'info' or 'error'
      dropdown: false            # defines if the notification should be displayed in the dropdown and notifications page
      duration: null             # `null`, `positive integer` or -1
      customClass: ''            # custom class to apply to the notification when shown

]

