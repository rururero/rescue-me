angular.module('wags', ['ngAnimate','ui.slider', 'ui.bootstrap'])
.controller( 'WagsCtrl', ['$scope', '$modal', function($scope, $modal) {
    var URL = "1y-kJ2lehFeMEn4avPAzf1b7RfsYTKL19fsznK8qaP_w";
    $scope.dogs = [];
    $scope.filterByType = {
        breed: [],
        size: [],
        sex: []
    }

    $scope.age = [1, 18];

    $scope.open = function ( dog) {
        $modal.open({
            templateUrl: 'dogDetail',
            controller: [ '$scope', 'dog', function ($scope, dog) {
                $scope.dog = dog;
            }],
            size: 'md',
            resolve: {
                dog: function () {
                    return dog;
                }
            }
        });
    };

    /**
     * Build the selection options for the filter.
     * Params:
     *   data: the data to pull the choices from
     *   filterObj: an object with the catrgories (keys) we should look for
     *
     * This loop is responsible for a lot (building selection list),
     * de-duping selections. It could probably be optimized.
     */
    function getFilterTypes( data, filterObj) {
        if(!data) return;

        for( var i = 0; i < data.length; i++){
            /**
             * This is an individual item, we will be pulling values from here
             * to build the selection options from
             */
            var item = data[i];

            for( var type in item){
                /**
                 * The type here is a selection category. It needs to exist in the
                 * filterObj object to get recognized.
                 */
                if( item.hasOwnProperty(type) && filterObj[type] !== undefined){
                    var opt = data[i][type];
                    console.log('opt', opt);

                    var optL = opt.toLowerCase();
                    console.log( 'optL', optL);
                    var feature = {name: optL, value: true};

                    /**
                     * Here we de-dupe the filter options so we don't get
                     * dupes in the list
                     */
                    var match = false;
                    for( var x = 0; x < filterObj[type].length; x++){
                        if( filterObj[type][x].name === feature.name) {
                            match = true;
                        }
                    }

                    /* don't make dupes! */
                    if( !match) {
                        filterObj[type].push( feature);
                    }
                }
            }
        }
    }

    function loadDogs(data) {
        $scope.dogs = data;
        $scope.$apply($scope.dogs);
        $scope.$apply(getFilterTypes( $scope.dogs, $scope.filterByType));
    }

    Tabletop.init( { key: URL, callback: loadDogs, simpleSheet: true } );

}]).filter('filterAttrib',function () {
    return function (collection, attrib) {
        /* Note: keep list needs to be de-duped */
        if (collection === null) return collection;

        var newCollection = [];
        var keepList = attrib.keepList;
        var property = attrib.name;

        if (!keepList || !property) return collection;

        for( var k = 0; k < keepList.length; k++) {
            var keep = keepList[k];
            for( var n = 0; n < collection.length; n++){
                var current = collection[n];
                var thisProperty = current[property].toLowerCase();
                if( keep.value && keep.name === thisProperty){
                    newCollection.push(current);
                }
            }
        }
        return newCollection;
    }
}).filter('filterAge',function () {
    return function (collection, ageRange) {
        if (collection === null) return collection;
        var newCollection = [];

        for( var i = 0; i < collection.length; i++){
            var item = collection[i],
                intAge = parseFloat( item.age);
            if( intAge >= ageRange[0] && intAge <= ageRange[1]){
                newCollection.push(item);
            }
        }

        return newCollection;
    }
}).filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});;