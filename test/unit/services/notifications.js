'use strict';
describe('Service: Notifications', function () {
  beforeEach(module('bc.notifications'));

  var $notifications;

  beforeEach(inject(function ($injector) {
    $notifications = $injector.get('Notifications');
  }));

  it('should load the service', function () {
    expect($notifications).toBeDefined();
  });
});
