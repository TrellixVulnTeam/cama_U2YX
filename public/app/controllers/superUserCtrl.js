angular
        .module('app')
        .controller('superUserCtrl', function ($scope, $q, $clubToast) {

            $scope.selectedItem = null;
            $scope.searchText = null;
            $scope.selectedUsers = [];

            var UsersRef = firebase.database().ref('users');

            $scope.isEmpty = function () {
                if ($scope.selectedUsers.length > 0)
                    return false;
                else
                    return true;
            };

            function getUsers(searchText) {
                var one = $q.defer();
                var users = [];

                UsersRef
                        .orderByChild('phone')
                        .startAt(searchText)
                        .endAt(searchText + "\uf8ff")
                        .once('value', function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                users.push({"key": childSnapshot.key, "name": childSnapshot.val().first_name + " " + childSnapshot.val().last_name});
                            });
                            one.resolve(users);
                        });

                return one.promise;
            }

            $scope.updateUsers = function (searchText) {
                var results = searchText ? getUsers(searchText) : [];
                return results;
            };

            $scope.openClub = function () {
                var root = firebase.database().ref();
                var clubesRef = root.child('clubes');
                var newClub = clubesRef.push({"name": "חדש", "active": true});
                $clubToast.show('המועדון נפתח', 'toaster-ancor', 'success');
                
                var rolesRef = root.child('roles');           
                $scope.selectedUsers.forEach(function (item) {
                    var userRef = rolesRef.child(item.key);
                    var newClubRole = userRef.child(newClub.key);
                    newClubRole.update({"role": 2});
                    
                    var usersRef = root.child('users').child(item.key).update({"role": 2});
                    
                });
                $clubToast.show('המשתשים קיבלו הרשאת מנהל למועדון', 'toaster-ancor', 'success');

                $scope.selectedItem = null;
                $scope.searchText = null;
                $scope.selectedUsers = [];
            };

        });
      