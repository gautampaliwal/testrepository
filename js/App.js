var app = angular.module('userApp', ["ngStorage"]);
var baseAddress = 'http://www.maidhkshatriya.com/api/UserService/';
var baseAddressLogin = 'http://www.maidhkshatriya.com/api/Login/';
var url = "";

app.factory('userFactory', function ($http) {
    return {
        getUsersList: function () {
            url = baseAddress + "GetUsersList";
            return $http.get(url);
        },
        getUser: function (user) {
            url = baseAddress + "GetUser/" + user.UserId;
            return $http.get(url);
        },
        addUser: function (user) {
            url = baseAddress + "AddUser";
            return $http.post(url, user);
        },
        deleteUser: function (user) {
            url = baseAddress + "DeleteUser/" + user.UserId;
            return $http.delete(url);
        },
        updateUser: function (user) {
            url = baseAddress + "ModifyUser/" + user.UserId;
            return $http.put(url, user);
        },
        LoginUser: function (Loguser) {
            url = baseAddressLogin + "Login";
            return $http.post(url, Loguser);
        },
    };
});

app.controller('userController', function PostController($scope, $localStorage, userFactory) {
    $scope.users = [];

    $scope.user = null;
    $scope.editMode = false;

    //get User
    $scope.get = function () {

        $scope.user = this.user;
        $('.listview').hide();
        $('.infosec').hide();
        $('.detailview').show();
    };

    $scope.ToggleLoginRegister = function (Islogin, IsRegister) {
        $scope.IsRegisterFormOn = Islogin;
        $scope.IsLoginFormOn = IsRegister;
        $scope.$apply();
    };

    //get all Users
    $scope.getAll = function () {
        userFactory.getUsersList().success(function (data) {
            $scope.users = data;
        }).error(function (data) {
            $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
        });
    };

    $scope.back = function () {
        $('.detailview').hide();
        $('.listview').show();
        $('.infosec').show();

    };

    $scope.LogOut = function () {
        $scope.CurrentUser = {};
        $localStorage.CurrentUser = {};
        console.log($localStorage.CurrentUser);
        $scope.Loguser = {};
        window.location.href = "index.html";

    };



    $scope.getAll();

});


app.controller('LoginController', function LoginController($scope, $localStorage, userFactory) {
    $scope.LogUser = { UserName: "", PassWord: "" };


    $scope.IsErrorMessageOn = false;
    $scope.IsRegisterFormOn = false;
    $scope.IsLoginFormOn = true;
    $scope.user = null;
    $scope.editMode = false;


    $scope.ToggleLoginRegister = function (Islogin, IsRegister) {
        $scope.IsRegisterFormOn = Islogin;
        $scope.IsLoginFormOn = IsRegister;
        $scope.$apply();
    };



    $scope.LoginUser = function (Loguser) {
        userFactory.LoginUser(Loguser).success(function (data) {
            $scope.CurrentUser = data;
            $localStorage.CurrentUser = $scope.CurrentUser;
            console.log($localStorage.CurrentUser);
            if ($scope.CurrentUser.UserId == 0) {
                $scope.IsErrorMessageOn = true;
            }
            else {
                window.location.href = "dashboard.html";
                $scope.IsErrorMessageOn = false;
            }
        }).error(function (data) {
            $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
        });
    };
    $scope.LogOut = function () {
        debugger;
        $scope.CurrentUser = {};
        $localStorage.CurrentUser = {};
        console.log($localStorage.CurrentUser);
        $scope.Loguser = {};
        window.location.href = "index.html";
        $scope.$apply();
    };



    if ($localStorage.CurrentUser != null && $localStorage.CurrentUser != undefined) {
        $scope.LogUser.UserName = $localStorage.CurrentUser.UserName;
        $scope.LogUser.PassWord = $localStorage.CurrentUser.Password;
        $scope.LoginUser($scope.LogUser);
    }


});