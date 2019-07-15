//Reference to the database
var database = "";
var db_ref_personalinfo;
var prev_limit = 0;
var swipes_left;
$( document ).ready(function() {
	//Get reference to database
  	database = firebase.database();
  	
  	//test_write_to_database();
    //for countdown banner
    database.ref('orders').orderByChild('time_ordered').limitToLast(1).once('value',snapshot => {
      latestordertime = Object.values(snapshot.val())[0].time_ordered;
      timenow = new Date().getTime();
      minspassed = Math.round((timenow - latestordertime) / (1000 * 60));
      minsleft = 15 - minspassed;
      if(minsleft >= 0) {
       $("body").overhang({
          type: "info",
          message: "Your order will be ready in " + minsleft + " mins!",
          duration: minsleft*60+1,
          upper: true,
          // callback: function (value) {
          //   $("body").overhang({
          //     // custom: true, // Set custom to true
          //     // primary: "#34495E", // Your custom primary color
          //     // accent: "#F4B350", 
          //     // type: "error",
          //     // message: "Your order is ready!",
          //     // closeConfirm: true
          //   })
          // }
        });   
      }
    });  


  	$(".gallery_item").click(function() {
  		entree_id_string = $(this).attr('id');
  		imageLocation = "assets/Bruin_Cafe/" + entree_id_string + ".jpg";
  		entree_name = entree_id_string.replace(/_/g, ' ');
  		swal({
			title: entree_name,
			text: "We'll let you know when the order is ready!",
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Order',
			imageUrl: imageLocation,
			imageWidth: 300,
			imageHeight: 200
		}).then((result) => {
  			if (result.value) {
    			swal(
      				'Confirmed!',
      				'Your order has been placed.',
      				'success'
    			);
    			
    			database.ref('orders').orderByChild('entree').equalTo(entree_name).once('value',snapshot => {
              currentTime = new Date().getTime();
              if (snapshot.exists()){
                var key = Object.keys(snapshot.val())[0];
                database.ref('orders').child(key).update({'time_ordered': currentTime});
              } else {
                json_to_push = {'entree': entree_name, 'time_ordered': currentTime, rating: 0};
                write_to_database(json_to_push, '/orders');
              }
          });
    			
    			decrement_swipes();

          $("body").overhang({
            type: "info",
            message: "Your order will be ready in 15 mins!",
            duration: 3,
            upper: true,
            // callback: function (value) {
            //   $("body").overhang({
            //     // custom: true, // Set custom to true
            //     // primary: "#34495E", // Your custom primary color
            //     // accent: "#F4B350", 
            //     // type: "error",
            //     // message: "Your order is ready!",
            //     // closeConfirm: true
            //   })
            // }
          });

  			}
		});
  	});

    db_ref_personalinfo = database.ref('/personal_info/');
    db_ref_personalinfo.on('value', function(snapshot){
      prev_limit = snapshot.val().daily_calorie_limit;
      // console.log(prev_limit);
      swipes_left = snapshot.val().swipes;
      if(swipes_left <= 0) swipes_left = "no";
      $('.daily-calorie-count').empty().text(prev_limit);
      $('span#swipes_left').empty().text(swipes_left);
    });

    
    // var db_ref_swipes = database.ref('/personal_info/swipes');
    // db_ref_swipes.once('value').then(function(snapshot) {
    //   swipes_left = snapshot.val();
    // });

});

function make_calorie_dial(){
    var calorie_limit = 0;
    var orders = {};
    var order_date_calories = [];
    db_ref_personalinfo = database.ref('/');
    db_ref_personalinfo.on('value', function(snapshot){
      calorie_limit = snapshot.val().personal_info.daily_calorie_limit;
      orders = snapshot.child("/orders/");
      
      orders.forEach(function(childSnapshot) {
      	json_entry = childSnapshot.val();
      	
      	var new_order = {'entree': json_entry.entree, 'time_ordered': json_entry.time_ordered};
      	order_date_calories.push(new_order);
      });
      
      entrees = snapshot.child("/entrees/");
      entrees.forEach(function(childSnapshot) {
      	entree_name = childSnapshot.key;
      	json_entry = childSnapshot.val();
      	calories = json_entry.calories;
      	
      	for (var i=0; i<order_date_calories.length; i++) {
      		if (order_date_calories[i].entree == entree_name) {
      			order_date_calories[i]['calories'] = calories;
      			break;
      		}
      	}
      });
      
      //Calculate how many calories are left in the day
      //Loop through each item in order_date_calories:
      	//If the time_ordered is less than 24 hours away, then add the calories for that entree to a running total
      
      var calories_consumed = 0;
      var posix_time_now = (new Date).getTime();
      var minutes = 1000 * 60;
      var hours = minutes * 60;
      
      for (var i=0; i<order_date_calories.length; i++) {
      	order_time = order_date_calories[i]['time_ordered'];
      	if ((posix_time_now - order_time) < 24*hours) {
      		calories_consumed = calories_consumed + order_date_calories[i]['calories'];
      	}
      }
      
      //Now calculate percent
      var percentVal = 0;
      if (calories_consumed < calorie_limit) {
      	var remaining_calories = calorie_limit - calories_consumed;
      	percentVal = Math.floor((remaining_calories/calorie_limit) * 100);
	var temp = remaining_calories + '/' + calorie_limit + ' kcal';
        $('#calorie-fraction').text(temp);
      }
      
      
      $("#calorie-circle").circliful({
        animationStep: 5,
        foregroundBorderWidth: 5,
        backgroundBorderWidth: 15,
        percent: percentVal,
        progressColor: { 31: '#666FFF', 0: '#FF3232', 61: '#00C957'}
      });
      
    });
 }

function decrement_swipes() {
	swipe_reference = '/personal_info/swipes';
    database.ref(swipe_reference).once('value').then(function(snapshot) {
    	previous_num_swipes = snapshot.val();
    	updates = {};
    	updates['/personal_info/swipes'] = previous_num_swipes - 1;
    	database.ref().update(updates);
    });
}


function cancel_daily_calories_edit(){
    // if(prev_limit === null)
    $('.calories_table tr:last').remove();
    $('.daily-calorie-count').empty();
    if(prev_limit === 0)
    {
      alert("Null value for prev_limit")
    }
    else{

      $('.daily-calorie-count').text(prev_limit)
    }
    $('.final_calories_td').after('<td class="edit_button_td"><button id="edit_button" class="btn btn--sm btn--blue" onclick="edit_daily_calories();">Edit</button></td>');
}

function save_daily_calories_edit(){
  var new_limit = $('.new_calorie_count').val();
  if(new_limit < 1500){
    alert("The minimum recommended daily calories count is 1500");
    // cancel_daily_calories_edit();
    return;
  }
  else if(new_limit > 8000)
  {
    alert("The maximum recommended daily calories count is 10000");
    // cancel_daily_calories_edit(); 
    return;
  }
  $('.calories_table tr:last').remove();
  db_ref_personalinfo.update({'daily_calorie_limit': new_limit});
  $('.daily-calorie-count').empty().text(new_limit);
  $('.final_calories_td').after('<td class="edit_button_td"><button id="edit_button" class="btn btn--sm btn--blue" onclick="edit_daily_calories();">Edit</button></td>');

}

function edit_daily_calories(){
  // console.log("entered");
  $('.edit_button_td').remove();
  $('.calories_table tr:last').after('<tr><td class="save_button_td"><button id="save_button" class="btn btn--sm btn--green" onclick="save_daily_calories_edit();">Save</button></td><td class="cancel_button_td" ><button id="cancel_button" class="btn btn--sm btn--red" onclick="cancel_daily_calories_edit();">Cancel</button></td></tr>');
  prev_limit = $('.daily-calorie-count').text();
  $('.daily-calorie-count').empty();
  var new_calorie_textbox = '<input type="number" class="new_calorie_count" placeholder="'+ prev_limit +'" value="'+ prev_limit +'" required min="1500" max="10000" step="50" style="font-size:12pt;height:25px;width:100px;align:center;">';
  $('.daily-calorie-count').html(new_calorie_textbox);
  $('.final_calories_td').attr("colspan", "2");
}

/*
	This function is used to test writing to the database. Right now, I have placed a call
	to the function in the document.ready() function and have commented that call.
	
	If testing locally, you can uncomment the function call and then there will be one
	record written to the database for each page that you visit because the document.ready()
	function is called as soon as the page loads.
	
*/
function test_write_to_database() {
	currentTime = new Date().getTime();
  	json_to_push = {'entree': 'turkey, lettuce, tomato', 'time_ordered': currentTime, rating: 0};
  	write_to_database(json_to_push, '/test/');
}

/*
	This is a generic function to use for pushing to Database Storage
	json_to_push: associative array
		Example: {'entree': 'turkey lettuce tomato', 'time_ordered': date-time object for javascript}
	ref_location: string representing location to write to in Database Storage
		Example: '/orders/'
*/
function write_to_database(json_to_push, ref_location) {
  	database.ref(ref_location).push(json_to_push, function(error) {
  		if (error) {
  			console.log("The write didn't work. Attempted JSON to push:\n" + json_to_push);
  		}
  	
  		else {
  			console.log("The write was successful. JSON pushed:\n" + json_to_push);
  			database.ref(ref_location).once('value').then(function(snapshot) {
  				console.log("Data in database for " + ref_location + " is now:\n" + snapshot.val());
  			});
  		}
  });
}
