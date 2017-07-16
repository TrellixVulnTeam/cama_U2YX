angular
        .module('app')
        .controller('managmentProfileCtrl', function ($scope, $mdSidenav, fileUpload) {
            $scope.openSideNavPanel = function () {
                $mdSidenav('left').open();
            };
            $scope.closeSideNavPanel = function () {
                $mdSidenav('left').close();
            };

            $scope.uploadFile = function () {
                var file = $scope.myFile;
                console.log('file is ');
                console.dir(file);
                var uploadUrl = "/fileUpload";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            };

            $scope.clubPicture = "img/empty-club.jpg";

            $scope.user = {
                title: 'Developer',
                email: 'ipsum@lorem.com',
                firstName: '',
                lastName: '',
                company: 'Google',
                address: '1600 Amphitheatre Pkwy',
                city: 'Mountain View',
                state: 'CA',
                biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
                postalCode: '94043'
            };
            
            $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
                    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
                    'WY').split(' ').map(function (state) {
                return {abbrev: state};
            });
        })
        ;
      