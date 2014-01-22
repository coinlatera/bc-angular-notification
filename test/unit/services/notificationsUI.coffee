describe 'Service: NotificationsUI', ->
  
  $notifUI = undefined
  $rootScope = undefined

  beforeEach ->
    if not $notifUI?
      module 'bc.notifications-ui'
      inject (NotificationsUI, _$rootScope_) ->
        $notifUI = NotificationsUI
        $rootScope = _$rootScope_

  it 'should load the service', ->
    expect($notifUI).toBeDefined()
    expect($rootScope).toBeDefined()

  it 'should have a default state', ->
    expect($notifUI.state()).toEqual
      paused: false

  it 'should save the state in the rootScope', ->
    expect($rootScope.state).toEqual
      paused: false

  it 'should have a state paused', ->
    $notifUI.pause()
    expect($notifUI.state()).toEqual
      paused: true

  it 'should have a state resumed', ->
    $notifUI.resume()
    expect($notifUI.state()).toEqual
      paused: false
