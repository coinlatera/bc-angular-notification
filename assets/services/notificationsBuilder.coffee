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

  buildNotification : (type, message, detailedMessage, displayMode, showInDropdown, params = {}, category, indexInCategory, duration) ->
    params["$id"] = Math.floor(Math.random() * 999999)
    return {
      id: params["$id"]
      title: postProcessMessage($filter('translate')(message, true), params)
      detailedTitle: postProcessMessage($filter('translate')(detailedMessage, true), params)
      read: false
      type: type
      display: displayMode
      date: new Date().getTime()
      showInDropdown: showInDropdown
      category: category
      indexInCategory: indexInCategory
      customClass: if params['customClass'] then params['customClass'] else ''
      duration: duration
    }
]

