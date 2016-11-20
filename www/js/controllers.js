angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope,Source,$ionicPopup,$rootScope,$cordovaBarcodeScanner,$q) {
    Source.initial();
    $scope.factor = [];
    $scope.sumOfCost = 0;
    var data = {}
    data.showDelete = 0;
    //$scope.factor.push(bottle)
    //$scope.factor.push(bottlle)
    //$scope.factor.push(bottle)
    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    $scope.addItem = function()
    {
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          if(isJson(barcodeData.text)) {
            var item = JSON.parse(barcodeData.text);
            mapToSource(item)
          }

          else{
            if(barcodeData.text != '')
              $ionicPopup.alert({
              title: "Error",
              template: "Please Check QR-Code",
              buttons: [
                {
                  text: '<b>Exit</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                  }
                }
                ,{
                  text: '<b>Again</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                    reScan();
                  }
                }
              ]
            })
          }
        })

    }
    $scope.editItem = function(item)
    {

    }
    $scope.removeItem = function(item,index)
    {
      item.source.remain += item.size;
      $scope.sumOfCost -= item.price;
      $scope.factor.splice(index, 1);
    }
   var mapToSource = function(item)
    {
      if(item.mode == 2) {
        $cordovaBarcodeScanner
          .scan()
          .then(function (barcodeData) {
            if (isJson(barcodeData.text)) {
              var sourceBarcode = JSON.parse(barcodeData.text);
              if (sourceBarcode.index != 2) {
                $ionicPopup.alert({
                  title: "Error",
                  template: "Please Read Source QR-Code!",
                  buttons: [
                    {
                      text: '<b>OK</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                      }
                    }
                  ]
                })
              }
              else {
                var source = Source.get(sourceBarcode.id)
                console.log("OK")
                item.price = item.size * source.cost;
                item.name = source.name;
                item.singleCost = source.cost;
                source.remain -= item.size;
                item.source = source;
                $scope.factor.push(item);
                $scope.sumOfCost += item.price;
              }
            }
            else {
              $ionicPopup.alert({
                title: "Error",
                template: "Please Check QR-Code",
                buttons: [
                  {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                    }
                  }
                ]
              })
            }
          }, function () {
            console.log("error")
          })
      }
      else{
        var source = Source.get(item.source.id)
        console.log("OK")
        item.price = item.size * source.cost;
        item.name = source.name;
        item.singleCost = source.cost;
        console.log(source,Source.all())
        //source.remain -= item.size;
        console.log(source,Source.all())
        item.source = source;
        item.source.remain -= item.size;
        $scope.factor.push(item);
        $scope.sumOfCost += item.price;
      }
    }
    var reScan = function() {
      $scope.addItem();
    }

    $scope.updateSource = function(source)
    {
        Source.modify(source);
    }
    $scope.finish = function()
    {
      $scope.sumOfCost = 0;
      for(var i = 0;i < $scope.factor.length ; i++)
      {
        var item = $scope.factor[i]
          $scope.updateSource(item.source);
      }
      $scope.factor = [];
    }
  })

.controller('ChatsCtrl', function($scope, Source,$ionicPopup,$rootScope,$cordovaBarcodeScanner) {

    $scope.description = function(item)
    {
      console.log(item)
      var myPopup = $ionicPopup.show({
        template: '<p><span>Size : </span>'+item.size+'</p>'+
        '<p><span>Company : </span>'+item.company+'</p><p><span>Remain : </span>'+item.remain+'</p>',
        title: item.name,
        scope: $scope,
        buttons: [
          { text: "OK",
            type: 'button-positive'
          }
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });

    }
    var reScan = function(){
      $scope.addSource();
    }
    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    $scope.searchSource = function(){
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          if(isJson(barcodeData.text)) {
            var source = JSON.parse(barcodeData.text);
            var item = Source.get(source.id)
            if(item != null) {
              var myPopup = $ionicPopup.show({
                template: '<p><span>Size : </span>' + item.size + '</p>' +
                '<p><span>Company : </span>' + item.company + '</p><p><span>Remain : </span>' + item.remain + '</p>',
                title: item.name,
                scope: $scope,
                buttons: [
                  {
                    text: "OK",
                    type: 'button-positive'
                  },
                ]
              })
              myPopup.then(function () {

              })
            }
            else
            {
              $ionicPopup.alert({
                title: "Error",
                template: "Source Not Found",
                buttons: [
                  {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                    }
                  }]
              })
            }
          }
          else{
            if(barcodeData.text != '')
              $ionicPopup.alert({
              title: "Error",
              template: "QR-Code Is Incorrect",
              buttons: [
                {
                  text: '<b>OK</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                  }
                }]
            })
          }
        })
    }
    $scope.addSource = function()
    {
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          if(isJson(barcodeData.text))
          {
            var source = JSON.parse(barcodeData.text);
            if(!Source.search(source) && source.index == 2)
              Source.add(source);
            else if(source.index == 2)
            {
              $ionicPopup.alert({
                title: "Error",
                template: "This Source Has already been entered!",
                buttons: [
                  {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                    }
                  }]
              })
            }
            else{
              $ionicPopup.alert({
                title: "Error",
                template: "Invalid QR-Code",
                buttons: [
                  {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                    }
                  }]
              })
            }
            $scope.sources = Source.all();
          }
          else{
            if(barcodeData.text != '')
              $ionicPopup.alert({
              title: "Error",
              template: "Please Check QR-Code",
              buttons: [
                {
                  text: '<b>Cancel</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                  }
                }
                ,{
                  text: '<b>Again</b>',
                  type: 'button-positive',
                  onTap: function (e) {
                    reScan();
                  }
                }
              ]
            })
          }
        })
    }
    $scope.data = {};
    $scope.data.showDeleteSource = 0;
    $scope.removeSource = function(source)
    {
      var myPopup = $ionicPopup.show({
        template: 'Are you Sure ?',
        title: source.name,
        scope: $scope,
        buttons: [
          { text: "Yes" ,
            type: 'button-positive',
            onTap: function (e) {
              Source.remove(source);
              //Source.modify()
            }
          },
          {
            text: "NO",
            type: 'button-assertive'
          }
        ]
      });
      myPopup.then(function(){

      })
    }
    Source.initial();
    $scope.sources = Source.all();
  $rootScope.$on("updateSource",function(){
    $scope.sources = Source.all();
  })
  $scope.remove = function(source) {
    Source.remove(source);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Source) {
  $scope.source = Source.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,Source,dateFactory,$ionicPopup) {
    $scope.data = {};
    $scope.data.showDeleteReport = 0
    Source.initial();
    var reports = localStorage.getItem('Report');
    if(reports == null)
      $scope.reports = []
    else
      $scope.reports =JSON.parse(reports)
    $scope.addReport = function()
    {
      $scope.earningMoney = 0;
      var sources = Source.all();
      var date = new Date();
      var solarDate = dateFactory.toJalaali(date.getFullYear(),date.getMonth() + 1,date.getDate())
      var dateTime =  solarDate.jy +" / "+ solarDate.jm +" / "+solarDate.jd + " -- " + date.getHours() + " : " + date.getMinutes()
      for(var i=0;i<sources.length;i++)
      {
        $scope.earningMoney += sources[i].cost * (sources[i].prevRemain - sources[i].remain)
        //sources[i].prevRemain = sources[i].remain;
      }
      var myPopup = $ionicPopup.show({
        template: 'Save ?',
        title: 'Your Cost Is : ' +'<h3>'+$scope.earningMoney +'</h3>',
        scope: $scope,
        buttons: [
          { text: "Yes" ,
            type: 'button-positive',
            onTap: function (e) {
              for(var i=0;i<sources.length;i++)
              {
                //$scope.earningMoney += sources[i].cost * (sources[i].prevRemain - sources[i].remain)
                sources[i].prevRemain = sources[i].remain;
              }
              console.log($scope.earningMoney)
              $scope.reports.unshift({"date":dateTime ,"reportMoney":$scope.earningMoney})
              var tempSave = JSON.stringify($scope.reports)
              localStorage.setItem('Report',tempSave);
              //Source.modify()
            }
          },
          {
            text: "NO",
            type: 'button-assertive'
          }
        ]
      });
      myPopup.then(function(){

      })
    }
    $scope.removeReport = function(item,index)
    {
      var myPopup = $ionicPopup.show({
        template: 'Are you Sure ?',
        title: item.date,
        scope: $scope,
        buttons: [
          { text: "Yes" ,
            type: 'button-positive',
            onTap: function (e) {
              $scope.reports.splice(index,1)
              var tempSave = JSON.stringify($scope.reports)
              localStorage.setItem('Report',tempSave);
            }
          },
          {
            text: "NO",
            type: 'button-assertive'
          }
        ]
      });
      myPopup.then(function(){

      })
    }
});
