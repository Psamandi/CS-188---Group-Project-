$( document ).ready(function() {
	//Get reference to database
  	database = firebase.database();

    //populate past-order div in past-order html
    database.ref('orders').orderByChild('time_ordered').once('value', function(snapshot){
      //resets after re-order...
      $(".past-order_item").remove();
      
      snapshot.forEach(function(itemSnapshot) {
        // console.log(itemSnapshot.val());

        entree_name = itemSnapshot.val().entree;
        entree_name = entree_name.replace(/ /g, '_');
        entree_rating = itemSnapshot.val().rating;
        imageLocation = "assets/Bruin_Cafe/" + entree_name + ".jpg";
        
        var entree_description, entree_calorie;
        // Couldn't get it to work... Some how this is called after not during.
        // database.ref('entrees').child(itemSnapshot.val().entree).once('value',snapshot => {
        //     entree_calorie = snapshot.val().calories;
        //     entree_description = snapshot.val().information;
        // });

        switch(entree_name) {
            case "California_Turkey_Club":
              entree_calorie = 710;
              entree_description = "Roasted Turkey Breast, Bacon, Sliced Avocado, Lettuce, Tomato, and Mayo on a Whole Wheat French Roll.";
              break;
            case "Honey_Mustard_Chicken_Bacon_Sandwich":
              entree_calorie = 886;
              entree_description = "Sliced Chicken Breast, Bacon, Swiss Cheese, Caramelized Onions, Jalapenos, Lettuce, and Honey-Mustard on a French Roll.";
              break;
            case "Roasted_Vegetable_and_Hummus":
              entree_calorie = 478;
              entree_description = "Roasted Red Pepper, Grilled Portobello Mushrooms, Roasted Eggplant, Hummus, and Shredded Kale Salad on a Vegan Whole Wheat French Roll.";
              break;
            case "Salmon_Salad_Sandwich":
              entree_calorie = 577;
              entree_description = "Housemade Salmon Salad, Mesclun Lettuce Mix, and Dijon Mustard on a French Roll.";
              break;
            case "Meat_Lovers_Pizza":
              entree_calorie = 809;
              entree_description = "Sliced Meatballs, Pepperoni, and Italian Sausage covers our Cheese Pizza with House-made Pizza Sauce";
              break;
            case "Florentino_Panini":
              entree_calorie = 716;
              entree_description = "Grilled Marinated Chicken Breast, Mozzarella Cheese, Fresh Spinach, Roma Tomatoes and Creamy Pesto";
              break;
            case "Margherita":
              entree_calorie = 915;
              entree_description = "Fresh Tomato & Basil on a Roman Style Flatbread";
              break;
            case "Lasagna_Bolognese":
              entree_calorie = 798;
              entree_description = "Baked Layers of Pasta, Meat Sauce, Ricotta, Mozzarella, and Parmesan Cheese";
              break;
            case "Pork_Tonkatsu":
              entree_calorie = 703;
              entree_description = "Panko-breaded Pork Chop served over White Rice, sautéed Green Cabbage, and Tomato Wedges, drizzed with Seasoned Rice Vinegar. Served with Tonkatsu Sauce and Sweet & Spicy Thai Sauce.";
              break;
            case "BBQ_Chicken_Quesadilla":
              entree_calorie = 765;
              entree_description = "Grilled Chicken, BBQ Sauce, Red Onions, and Jack & Gouda Cheeses in a Flour Tortilla, topped with Sour Cream & Guacamole. Served with Mexican Rice and Refried Beans.";
              break;
            case "Shrimp_Sushi_Bowl":
              entree_calorie = 768;
              entree_description = "Sushi Rice topped with Spicy Mayo Shrimp, Japanese Cucumber, Seaweed Salad, Takuwan, Edamame, Sliced Avocado, and Roasted Sesame Seeds, drizzled with Eel Sauce and Spicy Mayo.";
              break;
            case "Churros":
              entree_calorie = 683;
              entree_description = "With choice of Chocolate or Caramel Dipping Sauce. Served with Hot Chocolate or Hot Vanilla.";
              break;
            case "Belgian_Waffle":
              entree_calorie = 481;
              entree_description = "Whipped Cream and Seasonal Fresh Fruits topped on a freshly-made Belgian Waffle";
              break;
            case "Croque_Madame":
              entree_calorie = 854;
              entree_description = "The classic Ham and Cheese sandwich covered in Bechamel Sauce topped with a fried sunny-side up egg.";
              break;
            case "Granola_Oatmeal_Apple_Parfait":
              entree_calorie = 555;
              entree_description = "Housemade Chia Seed Oatmeal & Housemade Apple Sauce layered with Granola, Low-Fat Greek Yogurt, and a touch of Honey";
              break;
            case "Fruit_Oat_Smoothie":
              entree_calorie = 346;
              entree_description = "Bananas & Avocado blended with fresh Orange Juice, Oat Milk, Lemon Juice, and a touch of Honey";  
            break;
            default:
              entree_calorie = 0;
              entree_description = "No such entree exists in UCLA";
        }

        $(".past-order").prepend("<div class='past-order_item'> <img class='p' src='"
                                  +imageLocation
                                  +"' width=25% height=100%>"
                                  +"<table style='width:75%; height:100%'> <tr> <td> <table> <tr> <td> <div class='title'>"
                                  +itemSnapshot.val().entree
                                  +"</div>"
                                  +"</td> </tr> <tr> <td> <div class='desc'>"
                                  +entree_description
                                  +"</div> </td> </tr>"
                                  +"<tr> <td> <div class='p-calories'> Calories: "
                                  +entree_calorie
                                  +"</div> </td> </tr> </table>"
                                  +"</td> <td width=200px>"
                                  +"<div class='"
                                  +entree_name
                                  +"-stars'></div>"
                                  +"<button class='btn btn--sm btn--blue' id="
                                  +entree_name
                                  +">Re-Order</button> </td> </tr> </table> </div>"
                                  +" </div>");

        //stars
        switch(entree_name){
          case "California_Turkey_Club":
              $(".California_Turkey_Club-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Honey_Mustard_Chicken_Bacon_Sandwich":
              $(".Honey_Mustard_Chicken_Bacon_Sandwich-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Roasted_Vegetable_and_Hummus":
              $(".Roasted_Vegetable_and_Hummus-stars").stars({
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Salmon_Salad_Sandwich":
              $(".Salmon_Salad_Sandwich-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Meat_Lovers_Pizza":
              $(".Meat_Lovers_Pizza-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Florentino_Panini":
              $(".Florentino_Panini-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Margherita":
              $(".Margherita-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Lasagna_Bolognese":
              $(".Lasagna_Bolognese-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Meat_Lovers_Pizza":
              $(".Meat_Lovers_Pizza-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Pork_Tonkatsu":
              $(".Pork_Tonkatsu-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "BBQ_Chicken_Quesadilla":
              $(".BBQ_Chicken_Quesadilla-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Shrimp_Sushi_Bowl":
              $(".Shrimp_Sushi_Bowl-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Churros":
              $(".Churros-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Belgian_Waffle":
              $(".Belgian_Waffle-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Croque_Madame":
              $(".Croque_Madame-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Granola_Oatmeal_Apple_Parfait":
              $(".Granola_Oatmeal_Apple_Parfait-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            case "Fruit_Oat_Smoothie":
              $(".Fruit_Oat_Smoothie-stars").stars({ 
                value: entree_rating,
                click: function(i) {
                  database.ref('orders').orderByChild('entree').equalTo(itemSnapshot.val().entree).once('value',snapshot => {
                    if (snapshot.exists()){
                      var key = Object.keys(snapshot.val())[0];
                      database.ref('orders').child(key).update({'rating': i});
                    }
                  });
                }
              });
              break;
            default:
              break;
        }
        
        //need to make generated buttons clickable
        $(".btn.btn--sm.btn--blue").click(function() {
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
          //We want to reload the page
            if (result.value) {
              swal(
                {title: "Confirmed!", text: "You order has been placed!", type: "success"
                }).then(function(){ 
                  location.reload();
                }
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
            }
        });
        });
      });
    });

});