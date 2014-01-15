'use strict'

var app = angular.module('buttercoinAngularNotificationTestApp', ['bc.angular-notification', 'ngAnimate', 'ngRoute']);

app.config(['$provide', function ($provide) {
  $provide.constant('CONFIG', { locale: 'fr_FR' });
  $provide.constant('Strings', {
    'known_english_translation': {
      'en_US': 'We sent you another code via SMS [link url=#/notifications/_$id_]Learn more[/link]',
      'fr_FR': 'Nous vous avons envoyé un nouveau code par SMS [link url=#/notifications/_$id_]En savoir plus[/link]'
    },
   'no_french_translation': {
     'en_US': 'I am the English-only version of the target string',
   }
  });
}]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'views/home.html' });
  $routeProvider.when('/page1', { templateUrl: 'views/page1.html' });
  $routeProvider.when('/page2', { templateUrl: 'views/page2.html' });
}]);