angular.module('bc.notifications-builder', ['bc.angular-i18n']).service 'NotificationsBuilder', ['$filter', ($filter) ->

  postProcessMessage = (message, params) ->
    message = message.replace /\[blue\]([^\[]*)\[\/blue\]/, '<span class="notif-blue">$1</span>'
    message = message.replace /\[green\]([^\[]*)\[\/green\]/, '<span class="notif-green">$1</span>'
    message = message.replace /\[red\]([^\[]*)\[\/red\]/, '<span class="notif-red">$1</span>'
    message = message.replace /\[button\]([^\[]*)\[\/button\]/, '<a class="notif-link">$1</a>'
    message = message.replace /[^\\]_([a-zA-Z0-9]+)_/g, (text, key) -> text[0] + params[key]
    message = message.replace /^_([a-zA-Z0-9]+)_/g, (text, key) -> params[key]
    message = message.replace /\\_/g, (text) -> '_'
    message = message.replace /\[button url=([^\]]*)\]([^\[]*)\[\/button\]/, '<a class="notif-link" href="$1">$2</a>'
    return message

  buildNotification : (type, message, displayMode, showInDropdown, params = {}, category, indexInCategory, duration) ->
    id: Math.floor(Math.random() * 999999)
    title: postProcessMessage($filter('translate')(message, true), params)
    description: ''
    read: false
    type: type
    display: displayMode
    date: new Date().getTime()
    showInDropdown: showInDropdown
    button:
      url: ''
      title: ''
    category: category
    indexInCategory: indexInCategory
    customClass: if params['customClass'] then params['customClass'] else ''
    duration: duration
]

