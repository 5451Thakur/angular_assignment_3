(function() {
  'use strict';
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems)
  .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json')

  NarrowItDownController.$inject =['MenuSearchService']
  function NarrowItDownController(MenuSearchService){
    var nid = this;
    var items = [];
    nid.message = "";
    nid.searchTerm = "";

    nid.search = function(){
      if(nid.searchTerm.length != 0){
        var promise = MenuSearchService.getMatchedMenuItems(nid.searchTerm);
        nid.found = "";
        promise.then(function(response){
          var num_items_found = response.data.length;
          if( num_items_found > 0){
            nid.message = ("Found " + num_items_found + " matching items for " + nid.searchTerm);
            nid.found = response.data;
          }else { nid.message = "Nothing found"; } //No matching items were found
        }).catch(function(error){
          nid.message = "Nothing found"; //If error is caught in the promise
        })
      }
      else{ nid.message = "Nothing found";}  //No search term provided
    };

    nid.remove = function (itemIndex) {
      nid.found.splice(itemIndex, 1);
      var num_items_left = nid.found.length;
      if(num_items_left > 0){
      nid.message = ("Remaining "+ num_items_left + " matching items for " + nid.searchTerm);
      }
      else{nid.message = "All items deleted";}

  };

  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  function MenuSearchService($http, ApiBasePath){
    var service = this;

      service.getMatchedMenuItems = function(term){
        var items = [];

        var r = $http({
            method: "GET",
            url: ApiBasePath
          });
          r.then(function(response){
            var i = 0;
            for(i=0; i< response.data['menu_items'].length; i++ ){
              var d = response.data['menu_items'][i]["description"];
              if(d.toLowerCase().indexOf(term.toLowerCase()) !== -1){
                items.push({name: response.data['menu_items'][i]["name"],
                description: response.data['menu_items'][i]["description"],
                short_name: response.data['menu_items'][i]["short_name"]});
                }
              }
              response.data = items;
          }, function(response){ });
          return r;
        }

  }


  function FoundItems(){
    var ddo = {
      templateUrl: 'foundItems.html',
      scope:{
        items: '<',
        remove: '&'
      }
    };
    return ddo;

  }


}());
