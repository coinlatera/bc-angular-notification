describe 'Service: NotificationsBuilder', ->
  
  $notifB = undefined

  beforeEach ->
    if not $notifB?
      module 'bc.notifications-builder'
      angular.module('bc.translate', []).filter 'translate', -> (input) -> input
      inject (NotificationsBuilder) ->
        $notifB = NotificationsBuilder

  it 'should load the service', ->
    expect($notifB).toBeDefined()

  defaultNotif =
    general:
      id: ''
      date: ''
      read: false
      displayTime: 0
    content:
      message: ''
      details: ''
      params:
        id: ''
    display:
      mode: 'silent'
      location: ''
      permanent: false
      urgent: false
      type: 'success'
      dropdown: false
      duration: null
      customClass: ''

  adaptNotif = (defaultNotif, notif) ->
    defaultNotif.general.id = notif.general.id
    defaultNotif.general.date = notif.general.date
    defaultNotif.content.params.id = notif.general.id
    defaultNotif

  it 'should return the default skeleton of a notification', ->
    obj = $notifB.defaults()
    expect(obj).toEqual adaptNotif(defaultNotif, obj)

  it 'should generate an empty notification', ->
    notif = $notifB.buildNotification()
    expect(notif).toEqual adaptNotif(defaultNotif, notif)

  it 'should process the notification message', ->
    colors = ['blue', 'green', 'red']
    expectProcessFn = (msg, exp, params) ->
      notif = $notifB.buildNotification
        content:
          message: msg
          params: params
      expect(notif.content.message).toBe exp

    expectProcessFn '[' + c + ']test[/' + c + ']', '<span class="notif-' + c + '">test</span>' for c in colors
    expectProcessFn '[link]test[/link]', '<a class="notif-link">test</a>'
    expectProcessFn '[button]test[/button]', '<a class="btn btn-primary notif-button">test</a>'
    expectProcessFn '_test_', 'textStr', { test: 'textStr' }
    expectProcessFn '[link url=www.google.com]test[/link]', '<a class="notif-link" href="www.google.com">test</a>'
    expectProcessFn '[button url=www.google.com]test[/button]', '<a class="btn btn-primary notif-button" href="www.google.com">test</a>'
