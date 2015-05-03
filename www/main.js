var app = angular.module('app', ['onsen', 'ngStorage','ui.bootstrap']);


//define the code which runs for the all application
app.controller('controller', function($scope, $http, $localStorage, $interval) {
	//get the json file/professor and put all of it into the js object profs





  $scope.nome = $localStorage.first;
  $scope.cognome = $localStorage.last;
  $scope.matricola = $localStorage.id;
  $scope.main_page="home.html";
  $scope.serverUrl="192.168.0.3:8080";
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

    menu.setMainPage('booknow.html', {closeMenu: true});

  }

  $scope.book=function(id){

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



  /*this is to make the calendar collapsable*/
   $scope.isCalendarCollapsed = true;



	/*Functionto to open the calendar*/
	$scope.openCalendar = function(){

//		$http.get('http://localhost:8080/events/lessons').success(function(results) {
//	      $scope.lessons = results;
//		$http.get('http://localhost:8080/events/bookings').success(function(results) {
//	      $scope.bookings = results;

		/*This are events for the calendar*/
  		$scope.lessons = [
				{
					start: '2015-05-04T09:00:00',
					end: '2015-05-04T12:00:00'
				},
				{
					start: '2015-05-05T09:00:00',
					end: '2015-05-05T12:00:00'
				},
				{
					start: '2015-05-06T09:00:00',
					end: '2015-05-06T10:30:00'
				},
				{
					start: '2015-05-07T09:00:00',
					end: '2015-05-07T13:30:00'
				},
				{
					start: '2015-05-08T12:00:00',
					end: '2015-05-08T13:30:00'
				},
				{
					start: '2015-05-08T15:00:00',
					end: '2015-05-08T18:00:00'
				},
				];

		$scope.bookings = [
				{
					start: '2015-05-04T14:00:00',
					end: '2015-05-04T15:00:00'
				},
				];


		$scope.lessonsSource = {
			events: $scope.lessons,
			color: 'red',
			rendering: 'background',
			editable: false,
			overlap: false,
		};

		$(document).ready(function() {

		$('#calendar').fullCalendar({
			theme: true,
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'agendaWeek,agendaDay'
			},
			defaultView: 'agendaWeek',
			minTime: '08:00:00',
			maxTime: '19:00:00',
//			defaultDate: '2015-02-12',
			weekends: false,
			allDaySlot: false,
			slotDuration: '00:15:00',
			displayEventEnd: false,
			defaultTimedEventDuration: '00:15:00',
			eventLimit: true, // allow "more" link when too many events

			//select the days-hours you want to add the event
			selectable: true,
			selectHelper: true,
			selectOverlap: function(event){
				return event.rendering === 'background';
			},
			select: function(start, end) {
				var title = prompt('Event Title:');
				var eventData;
				if (title) {
					eventData = {
						title: title,
						start: start,
						end: end
					};
					$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
				}
				$('#calendar').fullCalendar('unselect');
			},

			eventSources: [
			$scope.lessonsSource,
			{
				events: $scope.bookings,
				color: 'green',
				editable: false,
			}
				]



		});

	});

	}



	 $scope.dialogs = {};
   /*Functionto to open the booking dialog box*/
  $scope.show = function(dlg) {
    if (!$scope.dialogs[dlg]) {
      ons.createDialog(dlg).then(function(dialog) {
        $scope.dialogs[dlg] = dialog;
        dialog.show();
      });
    }
    else {
      $scope.dialogs[dlg].show();
    }
  }
});

app.controller('bookingDialogCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

   $scope.mytime = new Date();
  $scope.mytime2 = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});
