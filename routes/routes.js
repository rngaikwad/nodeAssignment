var mongoose = require( 'mongoose' );
var UserModel = mongoose.model( 'UserModel' );
var FeedbackModel = mongoose.model( 'FeedbackModel' );
var bcrypt = require('bcryptjs');



exports.adminloginHandler = function (req, res){
  console.log("Inside adminloginHandler");
  res.render('adminlogin.handlebars', {});
};//loginHandler
exports.loginHandler = function (req, res){
	console.log("Inside loginHandler");
	res.render('login.handlebars', {});
};//loginHandler

exports.logoutHandler = function (req, res){
	console.log("Inside logoutHandler");
	req.session.destroy();
	res.render('login.handlebars', {});
};//logoutHandler

exports.adminlogoutHandler = function (req, res){
  console.log("Inside adminlogoutHandler");
  req.session.destroy();
  res.render('adminlogin.handlebars', {});
};//logoutHandler


exports.authHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var loginOutcome;
	console.log( "Inside authHandler--> Login=%s, Password=%s", nmReq, pwdReq);
	mongoose.model('UserModel').findOne({username:nmReq}, function(err, userObj){
	    if(userObj === null){
	     	loginOutcome = "Login Failed: User name does not exist in db";
	     	res.render('login.handlebars', {errorMessage:loginOutcome});
	    } else {  //userObj is Not NULL

			console.log( "Password [%s] being matched with hashed password [%s] using bcrypt.compare", 
						pwdReq, userObj.password);
	    	bcrypt.compare(pwdReq, userObj.password, function(errCompare, isMatch) {
		        if (errCompare) {
		        	loginOutcome = "Login Failed : bcrypt.comare yielded error" ;
					res.render('login.handlebars', {errorMessage:loginOutcome});
		        }else if (isMatch === true){
					loginOutcome = "Login successful";
					res.render('landingpage.handlebars', {MSG:loginOutcome});
				} else{
					loginOutcome = "Login Failed: Password did not match";
					res.render('login.handlebars', {errorMessage:loginOutcome});
				}
				console.log( "Login outcome [%s]", loginOutcome);
				
			});// bcrypt.compare assynch
	   }//userObj is Not NULL
	});//findOne
}; //authHandler

exports.adminauthHandler = function (req, res){

  var nmReq = req.body.nm;
  var pwdReq = req.body.pwd;
  var loginOutcome;
  console.log( "Inside authHandler--> Login=%s, Password=%s", nmReq, pwdReq);
  mongoose.model('UserModel').findOne({username:nmReq}, function(err, userObj){

      if(userObj === null){
        loginOutcome = "Login Failed: User name does not exist in db";
        res.render('adminlogin.handlebars', {errorMessage:loginOutcome});
      } else {  //userObj is Not NULL

      console.log( "Password [%s] being matched with hashed password [%s] using bcrypt.compare", 
            pwdReq, userObj.password);
        bcrypt.compare(pwdReq, userObj.password, function(errCompare, isMatch) {
            if (errCompare) {
              loginOutcome = "Login Failed : bcrypt.comare yielded error" ;
          res.render('login.handlebars', {errorMessage:loginOutcome});
            }

            else if (isMatch === true)
            {

                var name = userObj.name;
                console.log(userObj);
               loginOutcome = "Login successful"+name;
                res.render('adminlandingpage.handlebars', {MSG:loginOutcome,userObj});
                /* mongoose.model('UserModel').find({}, function(err, data){
                  console.log(">>>> " + data );
                res.render("adminlandingpage.handlebars", {data});
                });*/

           } 

        else{
          loginOutcome = "Login Failed: Password did not match";
          res.render('adminlogin.handlebars', {errorMessage:loginOutcome});
        }
        console.log( "Login outcome [%s]", loginOutcome);
        
      });// bcrypt.compare assynch
     }//userObj is Not NULL
  });

  
}; //adminauthHandler


exports.registerFormHandler = function(req, res){
   console.log("Inside registerFormHandler");
   res.render("register.handlebars", {});
}; //registerFormHandler

exports.feedbackFormHandler = function(req, res){
   console.log("Inside feedbackFormHandler");
   res.render("feedback.handlebars", {});
}; //feedbackFormHandler



exports.userdetailsFormHandler = function(req, res){
   console.log("Inside userdetailsFormHandler");


   mongoose.model('UserModel').find({}, function(err, data){
        console.log(">>>> " + data );

         res.render("userdetails.handlebars", {data});
    });
  
};
exports.feedbackdetailsFormHandler = function(req, res){
   console.log("Inside feedbackdetailsFormHandler");


   mongoose.model('FeedbackModel').find({}, function(err, data){
        console.log(">>>> " + data );

         res.render("feedbackdetails.handlebars", {data});
    });
  
};


exports.landingpageHandler = function(req, res){
   console.log("Inside landingpagehandler");
   res.render("landingpage.handlebars", {});
}; 

exports.landingpage2Handler = function(req, res){
   console.log("Inside landingpage2handler");
   res.render("landingpage2.handlebars", {});
}; 

exports.adminlandingpageHandler = function(req, res){
   console.log("Inside landingpage2handler");
   res.render("adminlandingpage.handlebars", {});
}; 



exports.feedbackSubmitHandler = function(req, res){
   console.log("Inside feedbackSubmitHandler");
	
  var nameReq = req.body.name;
  var locationReq = req.body.location;
  var commentsReq = req.body.comments;
  var ansReq1 = req.body.ans1;
  var ansReq2 = req.body.ans2;
  var ansReq3 = req.body.ans3;
  var ansReq4 = req.body.ans4;

   var feedbackdata = new FeedbackModel();

    feedbackdata.name = nameReq;
    feedbackdata.location = locationReq;
    feedbackdata.comments = commentsReq;
    feedbackdata.ans1 = ansReq1;
    feedbackdata.ans2 = ansReq2;
    feedbackdata.ans3 = ansReq3;
    feedbackdata.ans4 = ansReq4;

   //save to db through model
   feedbackdata.save(function(err,savedUser){
      
   			 if(err){
         var message = "Error to save";
         console.log(err);
         res.render("feedback.handlebars", {errorMessage:message});
         return;
       }
       else{

          req.session.newuser = savedUser.name;
         res.render('feedbackpage.handlebars', {MSG:"Feedback Saved succesfuly.."});
       }    
       
   });
};//feedbackSubmitHandler


exports.registerSubmitHandler = function(req, res){
   console.log("Inside registerSubmitHandler");
	
   var nameReq = req.body.name;
   var locationReq = req.body.location;
   var usernameReq = req.body.username;
   var passwordReq = req.body.password;

   console.log(nameReq);
   console.log(locationReq);

   var newuser = new UserModel();
   newuser.name = nameReq;
   newuser.location = locationReq;
   newuser.username = usernameReq;
   newuser.password = passwordReq;

   //save to db through model
   newuser.save(function(err, savedUser){
       if(err){
         var message = "A user already exists with that username or email";
         console.log(message);
         res.render("register.handlebars", {errorMessage:message});
         return;
       }else{
         req.session.newuser = savedUser.username;
         res.render('landingpage2.handlebars', {MSG:"Registration succesful"});
       }
   });
};//registerSubmitHandler
