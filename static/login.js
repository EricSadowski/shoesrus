
$(document).ready(function () {


    var status = sessionStorage.getItem('logStatus');
    var userLog = sessionStorage.getItem("username");
    console.log(userLog)

    if (status == 1) {
        $("#navLogin").hide();
        $("#loggedIn").show();
        $("#userDisplay").html(userLog)


     } else {
        $("#loggedIn").hide();
        $("#navLogin").show();
        
    $("#loginButton").click(function() {
                 let username = $("input[name=typeUserX]").val();
                 let password = $("input[name=typePasswordX]").val();
                 console.log(username);
                 sessionStorage.setItem('username', username);
                 sessionStorage.setItem('password', password);
 
                 $.ajax({
         url: "/api/users/me",
         type: "GET",
         headers: { 'x-auth-username': sessionStorage.getItem('username'), 'x-auth-password': sessionStorage.getItem('password') },
         dataType: "json",
         error: function(jqxhr, status, errorThrown) {
       loginFailedHandler();
         }
     }).done(function(success) {
         sweetAlert("Login Successful").then(function(){
            sessionStorage.setItem('role', success.role);
            sessionStorage.setItem('logStatus', 1);
            window.open("shop.html","_self")	
         });
	
         
     });
             });
            }

            $("#logout").click(function(){
                sessionStorage.setItem('username', null);
                sessionStorage.setItem('password', null);
                sessionStorage.setItem('role', null);
                sessionStorage.setItem('logStatus', 0);

                sweetAlert("Logged out").then(function(){
                    $("#loggedIn").hide();
                    $("#navLogin").show();
                    window.open("index.html","_self")	
                 });
            });
    
            
             //end of onready
         });
        
 
         function loginFailedHandler() {
             alert("Authentication failed");
             $("input[name=username]").val("");
             $("input[name=password]").val("");
             sessionStorage.setItem('username', '');
             sessionStorage.setItem('password', '');
             $("#authPane").show();
             $("#mainAppPane").hide();
         };