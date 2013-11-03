function getToken(usuario, password){

	$.ajax({

    url: 'http://iworld.ingehost.cl/api-loggin/',
    data: {username: usuario, password: password },
    type: 'post',
    crossDomain: true,
    dataType: 'json',
    success: function(data) { 
        console.log(data);
    	App.token = data.token;
    	return true; 
    },
    error: function() { 
    	var token = "";
    	return false;
    },
    
});
}