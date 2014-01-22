describe 'Service: Notifications', ->
  
  $notif = undefined
  $notifB = undefined
  $rootScope = undefined

  beforeEach ->
    if not $notif?
      module 'bc.notifications'
      module 'bc.notifications-builder'
      angular.module('bc.translate', []).filter 'translate', -> (input) -> input
      inject (Notifications, NotificationsBuilder, _$rootScope_) ->
        $notif = Notifications
        $notifB = NotificationsBuilder
        $rootScope = _$rootScope_

  it 'should load the service', ->
    expect($notif).toBeDefined()
    expect($notifB).toBeDefined()
    expect($rootScope).toBeDefined()

  it 'should have an empty array of notifications', ->
    array = $notif.all()
    expect(array).toEqual jasmine.any(Array)
    expect(array.length).toBe 0

  it 'should save the notifications in the rootScope', ->
    array = $rootScope.notifications
    expect(array).toEqual jasmine.any(Array)
    expect(array.length).toBe 0

  it 'should add a new notification', ->
    $notif.show $notifB.buildNotification()
    expect($notif.all().length).toBe 1

  it 'should have an unread notification', ->
    expect($notif.unread().length).toBe 1
    expect($notif.read().length).toBe 0

  it 'should read the notification', ->
    $notif.markAsRead $notif.unread()[0]
    expect($notif.unread().length).toBe 0

  it 'should remove the notification', ->
    expect($notif.all().length).toBe 1
    $notif.remove $notif.read()[0]
    expect($notif.all().length).toBe 0

  it 'should read all the notifications', ->
    $notif.show $notifB.buildNotification()
    $notif.show $notifB.buildNotification()
    expect($notif.unread().length).toBe 2
    expect($notif.read().length).toBe 0
    $notif.markAllAsRead()
    expect($notif.unread().length).toBe 0
    expect($notif.read().length).toBe 2

  it 'should remove all the notifications', ->
    expect($notif.all().length).toBe 2
    $notif.removeAll()
    expect($notif.all().length).toBe 0
