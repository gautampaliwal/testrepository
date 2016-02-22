    var app = angular.module('userApp', ["ngStorage"]);
        var baseAddress = 'http://www.maidhkshatriya.com/api/UserService/';
        var baseAddressLogin = 'http://www.maidhkshatriya.com/api/Login/';
        var url = "";

        app.factory('userFactory', function ($http) {
            return {
                getUsersList: function (PagingModel) {
                    url = baseAddress + "GetUsersList";
                    return $http.post(url, PagingModel);
                },
                getUser: function (user) {
                    url = baseAddress + "GetUser/" + $scope.UserId;
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
                    url = baseAddress + "ModifyUser/" + $scope.UserId;
                    return $http.put(url, user);
                },
                 LoginUser: function (Loguser) {
                    url = baseAddressLogin + "Login";
                    return $http.post(url, Loguser);
                },
            };
        });

        app.controller('userController', function PostController($scope, $localStorage,userFactory) {
            $scope.users = [];
            $scope.PagingModel={SearchKeyWord:"",page:0,pageSize:0};
            $scope.user = null;
            $scope.editMode = false;

            //get User
            $scope.get = function () {

                $scope.user = this.user;
                $('.listview').hide();
                $('.infosec').hide();
                $('.detailview').show();
            };
            
            $scope.ToggleLoginRegister=function(Islogin,IsRegister)
            {
             $scope.IsRegisterFormOn=IsRegister;
            $scope.IsLoginFormOn=Islogin;
            $scope.$apply();
            };

            // add User
            $scope.add = function () {

             
                debugger;

                var currentUser = this.user;
             
                    userFactory.addUser(currentUser).success(function (data) {

                    

                        debugger;

                        $scope.addMode = false;
                        currentUser.UserId = data;
                        $scope.users.push(currentUser);
                        window.location.href = "index.html";
                        //reset form
                        $scope.user = null;
                        // $scope.adduserform.$setPristine(); //for form reset

                        //  $('#userModel').modal('hide');
                      
                    }).error(function (data) {

                        alert("Error");
                        debugger;
                        $scope.error = "An Error has occured while Adding user! " + data.ExceptionMessage;
                    });
                
            };

            $scope.uploadimage = false;

            //get all Users
            $scope.getAll = function (PagingModel) {
                debugger;
                userFactory.getUsersList(PagingModel).success(function (data) {
                    debugger;
                    $scope.users = data;

                    if ($scope.uploadimage == false) {

                        $scope.currentuserdata();

                    }

                   
                }).error(function (data) {
                    alert("Error");
                    debugger;
                    $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
                });
            };


           $scope.male = function() {

                document.getElementById('searchtext').value = "Male";

                $scope.getAll();

            }


            $scope.currentuserdata = function () {

            

                debugger;
                $localStorage.CurrentUser;

                $scope.loginusername = $localStorage.CurrentUser.Name;

                if ($localStorage.CurrentUser.ImagePath != null) {
                    $scope.loginuserimage = "http://www.maidhkshatriya.com/UploadedFiles/"+$localStorage.CurrentUser.ImagePath;
                }
                else {
                    $scope.loginuserimage = "http://www.maidhkshatriya.com/UploadedFiles/DummyImage.png";
                }

                $scope.UserId = $localStorage.CurrentUser.UserId;

                dob = new Date($localStorage.CurrentUser.DOB);
                var today = new Date();
                var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
                $('#age').html(age + ' years old');

              

                

             
            }


            $scope.addimage = function () {

                $(".mainsection").hide();
                $("#photoupload").show();
              

            }


            $scope.upload = function () {

                debugger;
                var data = new FormData();
                var files = $("#fileUpload").get(0).files;
                data.append("UserID", $("#UserID").val());
                // Add the uploaded image content to the form data collection
                if (files.length > 0) {
                    data.append("UploadedImage", files[0]);
                    $scope.loginuserimage = "http://www.maidhkshatriya.com/UploadedFiles/" + files[0].name;
                 
                }

                // Make Ajax request with the contentType = false, and procesDate = false
                var ajaxRequest = $.ajax({
                    type: "POST",
                    url: "http://www.maidhkshatriya.com/api/fileupload/uploadfile",
                    contentType: false,
                    processData: false,
                    data: data
                });


                ajaxRequest.done(function (responseData, textStatus) {

               
                    debugger;

                    if (textStatus == 'success') {
                        if (responseData != null) {

                            debugger;
                            if (responseData.Key) {
                                $("#fileUpload").val('');
                               // $scope.loginuserimage = 
                                $('#photoupload').hide();
                                $(".mainsection").show();

                                $scope.uploadimage = true;

                                $scope.getAll();
                            
                               

                            } else {
                                alert(responseData.Value);
                            }
                        }
                    } else {
                        alert(responseData.Value);
                    }
                });


                //userFactory.uploadImage().success(function (data) {

                //    $('#photoupload').modal('hide');
                //}).error(function (data) {
                //    $scope.error = "An Error has occured while Updating user image! " + data.ExceptionMessage;
                //});
            }

            $scope.back = function ()
            {
            $('.detailview').hide();
            $('.listview').show();
            $('.infosec').show();
              
            };

$scope.LogOut=function()
{
$scope.CurrentUser={};
   $localStorage.CurrentUser={};
                    console.log($localStorage.CurrentUser);
$scope.Loguser={};
window.location.href="index.html";

};



            $scope.getAll($scope.PagingModel);

        });
        
        
        app.controller('LoginController', function LoginController($scope, $localStorage,userFactory) {
            $scope.LogUser={UserName:"",PassWord:""};
         
          
            $scope.IsErrorMessageOn=false;
            $scope.IsRegisterFormOn=false;
            $scope.IsLoginFormOn=true;
            $scope.user = null;
            $scope.editMode = false;

            
            $scope.ToggleLoginRegister=function(Islogin,IsRegister)
            {
                $scope.IsRegisterFormOn= IsRegister;
                $scope.IsLoginFormOn = Islogin;
            $scope.$apply();
            };


       


         

$scope.LoginUser=function(Loguser)
{

    debugger;
 userFactory.LoginUser(Loguser).success(function (data) {
                    $scope.CurrentUser = data;
                    $localStorage.CurrentUser=$scope.CurrentUser;
                    console.log($localStorage.CurrentUser);
                    if($scope.CurrentUser.UserId==0)
                    {
                    $scope.IsErrorMessageOn=true;
                    }
                    else {
                        debugger;
                    window.location.href="dashboard.html";
                    $scope.IsErrorMessageOn=false;
                    }
                }).error(function (data) {
                    $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
                });
};





$scope.LogOut=function()
{
debugger;
$scope.CurrentUser={};
   $localStorage.CurrentUser={};
                    console.log($localStorage.CurrentUser);
$scope.Loguser={};
window.location.href="index.html";
$scope.$apply();
};




        });