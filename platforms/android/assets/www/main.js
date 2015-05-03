var app = angular.module('app', ['onsen', 'ngStorage']);


//define the code which runs for the all application
app.controller('controller', function($scope, $http, $localStorage, $interval) {
	//get the json file/professor and put all of it into the js object profs





  $scope.nome = $localStorage.first;
  $scope.cognome = $localStorage.last;
  $scope.matricola = $localStorage.id;
  $scope.main_page="home.html";
  $scope.serverUrl="localhost:8080";
  if($scope.nome==null || $scope.cognome==null || $scope.matricola==null){
    $scope.main_page="login.html";
  }


  $http.get('http://'+$scope.serverUrl+'/professors')
    .success(function(data, status, headers, config) {
      $scope.profs = data;
      //to access to data call profs['id'].nome
  });



  /* This function put at the top an alert message with the string you pass
  like parameter. es. ng-click="alert('This is the message')" */
  $scope.alert = function(string) {
    ons.notification.alert({message: string});
  }


  /* Executed after the login form */
  $scope.login = function(){
    var first = document.getElementById("first").value;
    var last = document.getElementById("last").value;
    var id = document.getElementById("id").value;

    var su= document.getElementById("serverUrl").value;


    if(first=="" || last=="" || id==""){
      	alert("Please fill all the gaps");
        return;
    }
    menu.setMainPage('home.html', {closeMenu: true});
    $localStorage.first = first;
    $localStorage.last = last;
    $localStorage.id = id;
    $localStorage.serverUrl= su;
    $scope.nome = $localStorage.first;
    $scope.cognome = $localStorage.last;
    $scope.matricola = $localStorage.id;
    $scope.serverUrl = $localStorage.serverUrl;
  }


  $scope.checkTheConnection=function(){

    var networkState = navigator.connection.type;
    if(networkState != Connection.NONE){
      alert("Online! Type : "+ networkState);

    }else{alert("Sorry, you are offline!");}

  }

  /* Reload the menu-bar */
  $scope.reload=function(){
    $http.get('http://'+$scope.serverUrl+'/professors')
    .success(function(data, status, headers, config) {
      $scope.profs = data;
      //to access to data call profs['id'].nome
    })
    .error(function(){
      ons.notification.alert({message: "Unable to update!"});
    });
  }






  /*this function is called when clicking on a prof name
   * it manages the http get request for loading the data
   * needed for the prof profile page which is going to
   * be visualized
   */
  $scope.openProfile = function(id){
	  $http.get('http://'+$scope.serverUrl+'/professors/'+id)
	  .success(function(results, statusss, headersss, configss) {
	      $scope.profProfile = results.info;
              if($scope.profProfile.stato == 0){		//change the color of the class
    		  $scope.profStatus = "Not in the office";
    		  $(".profile-status").css("color","red");
    	      }else{
    		  $scope.profStatus = "In the office";
    		  $(".profile-status").css("color","#00ff6a");
    	      } //call profProfile.keyword to access data
	  });

	  menu.setMainPage('prof-profile.html', {closeMenu: true}) //opens the profile page
  }







  /* Reload the Prof status when you click on button */
  $scope.reload2=function(id){
	$http.get('http://'+$scope.serverUrl+'/professors/'+id)
	.success(function(results, statusss, headersss, configss) {
	      $scope.profProfile = results.info;
              if($scope.profProfile.stato == 0){
    		  $scope.profStatus = "Not in the office";
    		  $(".profile-status").css("color","red");
    	      }else{
    		  $scope.profStatus = "In the office";
    		  $(".profile-status").css("color","#00ff6a");
    	      }
	})
	.error(function(){
		ons.notification.alert({message: "Unable to update!"});
	});
  }


  /* Executed when you book now*/
  $scope.bookN=function(){

    menu.setMainPage('prenota.html', {closeMenu: true});
  }

  $scope.book=function(id){

    menu.setMainPage('prenota.html', {closeMenu: true});
    var d=new Date();
    var giorno= d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
    var ora=d.getHours()+":"+d.getUTCMinutes();

    var msg=document.getElementById("messaggio").value;
    var c= {"matricola": $scope.matricola,
            "nome":$scope.nome,
            "cognome":$scope.cognome,
            "giorno":giorno,
            "ora":ora,
            "id":id,
            "messaggio":msg
    };

    $http({
        method: 'POST',
        url: 'http://'+$scope.serverUrl+'/book-now',
        data: JSON.stringify(c),
        headers: {
            'Content-type': 'text/plain'
        }
    }).success(function(data, status, headers, config) {
      ons.notification.alert({message: data, title: "Book result", animation: "fade" });
    })
    .error(function(){
      ons.notification.alert({message: 'Unable to book! Retry!', title: "Book result", animation: "fade" });
      // oppure: ons.notification.alert({message: string});
    });


    menu.setMainPage('prof-profile.html', {closeMenu: true});
  }



});
