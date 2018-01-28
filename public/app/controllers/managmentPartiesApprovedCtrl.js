angular.module('app')

        .controller('managmentPartiesApprovedCtrl', function ($scope, usersInEvent, $state, $stateParams, $clubToast, $mdDialog, EVENTS, ModalService) {

//https://codepen.io/AskYous/pen/WwZZgM

            console.log(usersInEvent);
            $scope.users = usersInEvent;
            $scope.isOpen = false;
            $scope.all = false;
            $scope.updated = false;
            $scope.isFilterOpen = false;
            $scope.countt = 0;
            $scope.graph = {};
            $scope.currentEvent = EVENTS.GetOneEvent($stateParams.clubId, $stateParams.eventId);
            $scope.openModal = openModal;
            $scope.closeModal = closeModal;

            $scope.search = null;
            $scope.showPreSearchBar = function () {
                return $scope.search === null;
            };
            $scope.initiateSearch = function () {
                $scope.search = '';
            };
            $scope.showSearchBar = function () {
                return $scope.search !== null;
            };
            $scope.endSearch = function () {
                return $scope.search = null;
            };
            $scope.submit = function () {
                console.error('Search function not yet implemented');
            };



            $scope.config = {
                refreshDataOnly: true, // default: true
                deepWatchData: true
            };
            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 250,
                    valueFormat: function (d) {
                        return d3.format('.2%')(d / totalValues);
                    },
                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showValues: true, //Display pie labels
                    legendPosition: 'bottom',
                    useInteractiveGuideline: true,
                    labelType: 'percent', //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: false,
                    title: true,
                    margin: {
                        top: 5,
                        right: 5,
                        bottom: 5,
                        left: 5
                    },
                    noData: null,
                    showLegend: true,
                    defaultState: null,
                    labelsOutside: false,
                    legend: {
                        vers: "classic",
                    }
                },
                title: {
                    enable: true,
                    text: "יחס הרשמה נשים גברים",
                    className: "h4",
                    css: {
                        width: "nullpx",
                        textAlign: "center"
                    }
                }

            };
            function openModal(id) {
                ModalService.Open(id);
            }

            function closeModal(id) {
                ModalService.Close(id);
            }


            $scope.cancel = function () {
                $scope.users.forEach(function (user) {
                    console.log(user);
                    if (!user.sent && user.approved) {
                        user.approved = false;
                        $scope.users.$save(user);
                    }
                });
                $scope.$parent.partiesShow = true;
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                $clubToast.show('הרשימות לא עודכנו', 'managment-content', 'error');
            };
            

            $scope.changeState = function (user)
            {

                if (user.entered)
                    $scope.updated = true;
                else
                    $scope.updated = false;
                $scope.users.$save(user);
            };
            

            $scope.chart = function ()
            {



                $scope.data = [
                    {
                        label: "נשים",
                        value: $scope.currentEvent.pending.female,
                        color: "#ff4d6a"
                    },
                    {
                        label: "גברים",
                        value: $scope.currentEvent.pending.male,
                        color: "#4d94ff"
                    }
                ];
                $scope.data1 = [
                    {
                        label: "נשים",
                        value: $scope.currentEvent.approved.female,
                        color: "#ff4d6a"
                    },
                    {
                        label: "גברים",
                        value: $scope.currentEvent.approved.male,
                        color: "#4d94ff"
                    }
                ];
                $scope.openModal('pending-gender-graphs');
            };
            
            $scope.$watchCollection('currentEvent', function (newVal, oldVal) {


                console.log('in');
                console.log($scope.currentEvent);
                console.log(newVal);
                console.log(oldVal);
                if (newVal.pending.all !== oldVal.pending.all) {
                    console.log('in if');
                    $scope.data = [
                        {
                            label: "נשים",
                            value: newVal.pending.female,
                            color: "#ff4d6a"
                        },
                        {
                            label: "גברים",
                            value: newVal.pending.male,
                            color: "#4d94ff"
                        }
                    ];
                    setInterval(function () {
                        $scope.$apply(); // update both chart
                    }, 500);
                }
                if (newVal.approved.all !== oldVal.approved.all) {
                    console.log('in if');
                    $scope.data1 = [
                        {
                            label: "נשים",
                            value: newVal.approved.female,
                            color: "#ff4d6a"
                        },
                        {
                            label: "גברים",
                            value: newVal.approved.male,
                            color: "#4d94ff"
                        }
                    ];
                    setInterval(function () {
                        $scope.$apply(); // update both chart
                    }, 500);
                }

            });

            $scope.filterAll = function ()
            {

                EVENTS.GetUsersInEvent($stateParams.clubId, $stateParams.eventId).then(function (data) {
                    $scope.users = data;
                });
            };
            
            $scope.showConfirm = function (ev, user) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm({
                    controller: AvatarCtrl,
                    templateUrl: 'app/templete/avatar.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {
                        User: user
                    },
                    targetEvent: ev
                });
                $mdDialog.show(confirm).then(function () {
                    $scope.status = 'Confirm resolved';
                    $scope.codeRunningBeforeResolve = 'code only runs after resolve';
                });
                $scope.codeRunningBeforeResolve = 'code is running before resolve!';
            };
        });
        
function AvatarCtrl($scope, $mdDialog, User) {
    $scope.User = User;
    console.log(User);
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
