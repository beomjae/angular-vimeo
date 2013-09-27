var app = angular.module('vimeoApp',[]);

app.factory('Channels', ['$rootScope','$http',function($rootScope,$http){
  var channels = [
    {name:'hdmusicvideos',info:{},videos:[]},
    {name:'animade',info:{},videos:[]}
  ];

  return channels;
}]);

app.config(function($routeProvider){
  $routeProvider.
      when('/', {controller:channelListController, templateUrl:'channellist.html'}).
      when('/channel/:channelName', {controller:videosController, templateUrl:'videos.html'}).
      otherwise({redirectTo:'/'});  
});

function channelListController($http,$scope,Channels){
  $scope.channels = Channels;

  $scope.fetchChannels = function() {
    var infocount = 0;
    _.forEach(Channels, function(channel){
      $http.jsonp('http://vimeo.com/api/v2/channel/'+channel.name+'/info.json?callback=JSON_CALLBACK').success(function(infodata){
          console.log(infodata);
          $scope.channels[infocount].info = infodata;
          infocount++;
       });    
    });

    var videoscount = 0;
    _.forEach(Channels, function(channel){
      $http.jsonp('http://vimeo.com/api/v2/channel/'+channel.name+'/videos.json?callback=JSON_CALLBACK').success(function(videosdata){
          console.log(videosdata);
          $scope.channels[videoscount].videos = videosdata;
          videoscount++;
       });    
    });  
  }

  $scope.addChannel = function(){
    var newChannel = {};
    newChannel.name = $scope.newChannelName;
    $http.jsonp('http://vimeo.com/api/v2/channel/'+newChannel.name+'/info.json?callback=JSON_CALLBACK').success(function(infodata){
      $scope.channels.push(newChannel);
      $scope.fetchChannels();
    });  

    $scope.newChannelName = "";

  }

  $scope.fetchChannels();
}

function videosController($http,$scope,Channels){
  $scope.channels = Channels;


}