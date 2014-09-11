'use strict';

angular.module('nnanimalsApp')
    .controller('NeuralCtrl', function ($scope, $http, $modal) {

        $scope.groups = [
            {
                name: '1 - (41)',
                members: 'aardvark, antelope, bear, boar, buffalo,' +
                    'calf, cavy, cheetah, deer, dolphin, elephant, fruitbat, giraffe,' +
                    'girl, goat, gorilla, hamster, hare, leopard, lion, lynx, mink, mole, mongoose,' +
                    'opossum, oryx, platypus, polecat, pony, porpoise, puma, pussycat, raccoon, reindeer,' +
                    'seal, sealion, squirrel, vampire, vole, wallaby, wolf',
                image: '/images/elephant.png',
                selected: false

            },
            {
                name: '2 - (20)',
                members: 'chicken, crow, dove, duck, flamingo, gull, hawk, kiwi, lark, ostrich,' +
                    'parakeet, penguin, pheasant, rhea, skimmer, skua, sparrow, swan, vulture, wren',
                image: '/images/chicken.gif',
                selected: false

            }
            ,
            {
                name: '3 - (5)',
                members: 'pitviper, seasnake, slowworm, tortoise, tuatara',
                image: '/images/turtle.png',
                selected: false

            }
            ,
            {
                name: '4 - (13)',
                members: 'bass, carp, catfish, chub, dogfish, haddock, herring,' +
                    'pike, piranha, seahorse, sole, stingray, tuna',
                image: '/images/fish.png',
                selected: false

            }
            ,
            {
                name: '5 - (4)',
                members: 'frog, frog, newt, toad',
                image: '/images/frog.jpg',
                selected: false

            }
            ,
            {
                name: '6 - (8)',
                members: 'flea, gnat, honeybee, housefly, ladybird, moth, termite, wasp',
                image: '/images/bee.jpg',
                selected: false

            } ,
            {
                name: '7 - (10)',
                members: 'clam, crab, crayfish, lobster, octopus, scorpion, seawasp, slug, starfish, worm',
                image: '/images/crab.gif',
                selected: false

            }

        ];

        $scope.newAnimal = {
            hair: '1',
            feathers: '0',
            eggs: '0',
            milk: '0',
            airborne: '0',
            aquatic: '0',
            predator: '0',
            toothed: '1',
            backbone: '1',
            breathes: '1',
            venomous: '0',
            fins: '0',
            legs: '2',
            tail: '0',
            domestic: '0',
            catsize: '0'
        };

        $scope.result = {};
        $scope.category = 0;
        $scope.options = [
            {'name': 'No', 'value': '0'},
            {'name': 'Yes', 'value': '1'}
        ];
        $scope.legOptions = [
            {'name': '2', 'value': '2'},
            {'name': '4', 'value': '4'}
            ,
            {'name': '6', 'value': '8'}
            ,
            {'name': '8', 'value': '8'}

        ];
        $scope.evaluate = function () {
            _.each($scope.groups, function(group){
                group.selected = false;
            });

            var config = {
                headers: {
                    "contentType": "application/json"
                }
            };
            $http.post('/api/evaluate', $scope.newAnimal, config).success(function (data) {
                $scope.result = data.output;
                var category = $scope.result.indexOf(Math.max.apply(null, $scope.result));
                console.log(category);
                $scope.groups[category].selected = true;
                $scope.alerts.push({msg: JSON.stringify($scope.result, undefined, 2)});
                //console.log($scope.category);
                console.log(data);
				$scope.showResult();
            });
        };
		
		$scope.showResult = function () {
         	var modalInstance = $modal.open({
                templateUrl: './partials/result.html',
                controller: 'resultCtrl',
			
                resolve: {
                    group: function () {
					    
						var groupItem = _.find($scope.groups, function (x) { return x.selected })
						return  groupItem;
                    }
                    //newAnimal: $scope.newAnimal
                }
            });
        };

		
		
        var dialogOptions = {
            templateUrl: './partials/submit.html',
            controller: 'submitCtrl'
        };


        $scope.submit = function () {
            var modalInstance = $modal.open({
                templateUrl: './partials/submit.html',
                controller: 'submitCtrl',

                resolve: {
                    newAnimal: function () {
                        return $scope.newAnimal;
                    }
                    //newAnimal: $scope.newAnimal
                }
            });

            modalInstance.result.then(function (animal) {
                $scope.newAnimal = animal;
                $scope.evaluate();
                $scope.displayNewAnimal();
            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
            });

        };

        $scope.alerts = [

        ];

        $scope.displayNewAnimal = function () {
            $scope.alerts.push({msg: JSON.stringify($scope.newAnimal, undefined, 2)});
        };

        $scope.getAnimalJson = function () {
            return JSON.stringify($scope.newAnimal, undefined, 2);
        };


        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

    });

angular.module('nnanimalsApp')
    .controller('submitCtrl', function ($scope, $modalInstance, newAnimal) {
        console.log(newAnimal);
        $scope.newAnimal = newAnimal;

        $scope.save = function () {
            $modalInstance.close($scope.newAnimal);
        };

        $scope.close = function () {
            $modalInstance.close(undefined);
        };
        $scope.result = {};
        $scope.category = 0;
        $scope.options = [
            {'name': 'No', 'value': '0'},
            {'name': 'Yes', 'value': '1'}
        ];
        $scope.legOptions = [
            {'name': '0', 'value': '0'},
            {'name': '2', 'value': '2'},
            {'name': '4', 'value': '4'}
            ,
            {'name': '6', 'value': '8'}
            ,
            {'name': '8', 'value': '8'}

        ];
        $scope.evaluate = function () {
            var config = {
                headers: {
                    "contentType": "application/json"
                }
            };

            $http.post('/api/evaluate', $scope.newAnimal, config).success(function (data) {
                $scope.result = data.output;
                var category = $scope.result.indexOf(Math.max.apply(null, $scope.result));
                console.log(category);
                $scope.groups[category].selected = true;
                $scope.alerts.push({msg: JSON.stringify($scope.result, undefined, 2)});
                //console.log($scope.category);
                console.log(data);
            });
        };
    });
	angular.module('nnanimalsApp')
    .controller('resultCtrl', function ($scope, $modalInstance, group) {
        $scope.group = group;
		
        $scope.close = function () {
            $modalInstance.close(undefined);
        };
    });