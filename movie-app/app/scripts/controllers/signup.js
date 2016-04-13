'use strict';

/**
 * @ngdoc function
 * @name movieAppApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the movieAppApp
 */
angular.module('movieAppApp')
  .controller('SignupCtrl', function ($scope, $http, $log) {
        $scope.signup = function() {
            var payload = {
                email : $scope.email,
                password : $scope.password
            };

            $http.post('app/signup', payload)
                .success(function(data) {
                    $log.debug(data);
                });
        };
    });
