(function(){define(["app"],function(a){return a.directive("activeNotification",function(a,b){return{restrict:"E",template:'<div ng-show="showNotification" class="urgent-notification active" ng-class="className"><span ng-bind-html-unsafe="title"></span><div class="close"><i class="icon-remove-circle icon-large"></i></div></div>',link:function(c,d){var e,f,g,h,i;return c.showNotification=!1,h=function(a){var g;return c.notification=angular.copy(a),c.title=a.title,c.className=e(a.type),c.$$phase||c.$apply(),g=$(d[0]).find(".urgent-notification"),g.css({display:"block",top:-100}),g.animate({top:25},"slow",function(){return b(function(){return f()},3e3)})},g=!1,f=function(){return g?void 0:(g=!0,a.markAsRead(c.notification),$(d[0]).find(".urgent-notification").fadeOut("slow",i))},$(d[0]).find(".close").bind("click",function(){return f()}),e=function(a){return"error"===a||"urgent"===a?"orange":"pending"===a||"info"===a?"blue":"success"===a?"green":"blue"},i=function(){var a,b,d,e,f;for(g=!1,e=c.allNotifications,f=[],b=0,d=e.length;d>b;b++)if(a=e[b],a.read)f.push(void 0);else if("active"===a.display){if(null!=c.notification&&a.id===c.notification.id)continue;f.push(h(a))}else f.push(void 0);return f},c.$watch("allNotifications",function(a,b){return a!==b?i():void 0},!0),c.allNotifications=a.all(),i()}}})})}).call(this),function(){define(["app"],function(a){return a.directive("stickyNotification",function(a){return{restrict:"E",template:'<div ng-show="showNotification" class="urgent-notification sticky" ng-class="className"><span ng-bind-html-unsafe="title"></span><div class="close"><i class="icon-remove-circle icon-large"></i></div></div>',link:function(b,c){var d,e,f;return b.showNotification=!1,e=function(a){return $(c[0]).find(".urgent-notification").slideUp("slow","linear",function(){return b.notification=a,b.title=a.title,b.className=d(a.type),b.$$phase||b.$apply(),$(c[0]).find(".urgent-notification").slideDown("slow","linear")})},$(c[0]).find(".close").bind("click",function(){return a.markAsRead(b.notification),$(c[0]).find(".urgent-notification").slideUp("slow","linear",f)}),d=function(a){return"error"===a||"urgent"===a?"orange":"pending"===a||"info"===a?"blue":"success"===a?"green":"blue"},f=function(){var a,c,d,f,g;for(f=b.allNotifications,g=[],c=0,d=f.length;d>c;c++)if(a=f[c],a.read)g.push(void 0);else if("sticky"===a.display&&"urgent"===a.type){if(null!=b.notification&&a.id===b.notification.id)continue;g.push(e(a))}else g.push(void 0);return g},b.$watch("allNotifications",function(a,b){return a!==b?f():void 0},!0),b.allNotifications=a.all(),f()}}})})}.call(this),function(){define(["app"],function(a){a.service("Notifications",function(a){a.notifications=[],this.all=function(){return a.notifications},this.unread=function(){var b,c,d,e,f;for(c=[],f=a.notifications,d=0,e=f.length;e>d;d++)b=f[d],b.read||c.push(b);return c},this.read=function(){var b,c,d,e,f;for(c=[],f=a.notifications,d=0,e=f.length;e>d;d++)b=f[d],b.read&&c.push(b);return c},this.markAllAsRead=function(){var b,c,d,e;for(e=a.notifications,c=0,d=e.length;d>c;c++)b=e[c],b.read=!0},this.markAsRead=function(b){var c,d,e,f,g;for(f=a.notifications,g=[],d=0,e=f.length;e>d;d++)c=f[d],c.id===b.id?g.push(c.read=!0):g.push(void 0);return g},this.show=function(b){a.notifications.unshift(b)}})})}.call(this);