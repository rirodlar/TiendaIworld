$(document).ready(function(){

  //location.href="";
	App.init();

	$("#btnLogin").click(function(){
	   	App.recuperaToken();
	});

});


App = {
        token:"",
        baseapiurl : "http://iworld.ingehost.cl",    
        nombreTienda :"",
        tienda_id:"",
        boleta_id:"",
        caja_id:"",
        tipoComprobante:{
        			 "1" :"boleta",
        			 "2" :"factura"
        },
        formaPago:{
	        	"1": "efectivo",
	        	"2": "documento",
	        	"3": "credito",
	        	"4":"debito"
        },
        estadoCaja:{
        	"1": "abierta",
        	"2": "cerrada"
        },


init:function(){

},
/**
 * Obtener token de autentifcacion y cargar el HOME
 */
recuperaToken: function(){

		var usuario =  $("#nombre").val();
		var password = $("#password").val();

		if(usuario == "" || password == ""){

			alert("ingrese un nombre de usuario y password");

		}else{
				$.ajax({
				    url:   App.baseapiurl +"/api-loggin/",
				    data:  {username: usuario, password: password },
				    type: 'post',
				    crossDomain: true,
				    dataType: 'json',
				    success: function(data) { 
					    	App.token = data.token;
					    	location.href="#home";
					    	App.loadHome();
				    },
				    error: function() { 
				    		var token = "";
				    		alert("Error en la autentificación");
				    },
			});
		}
},
/**
 * Cargar el HOME
 * Uso de template UNDESCORE
 */
loadHome: function(){
		//Obtener la lista de las tiendas
    $.ajax({            
		        url: App.baseapiurl + "/movil/tiendas",
		        type: 'GET',
		        dataType: 'json',
		        success: function(data) {
		        		  App.drawChart();
													 var template = $("#template_listaTiendas").html();
   							 	 	$("#listaTiendas").html(_.template(template,{items:data})).trigger('create');
		        },
		        error: function() { alert('error al cargar el home ( lista de tiendas) '); },
		        beforeSend: App.setHeader
		});


	    //Cargar el total de ventas
		$.ajax({            
		        url:  App.baseapiurl + "/movil/totalventas",
		        type: 'GET',
		        dataType: 'json',
		        success: function(data) {
		           $("#totalVenta").html(data);
		        },
		        error: function() { alert('error al cargar el total de ventas '); },
		        beforeSend: App.setHeader
		});

    //Cargar el total de cajas
		$.ajax({            
		        url:  App.baseapiurl + "/movil/totalcaja",
		        type: 'GET',
		        dataType: 'json',
		        success: function(data) {
		           $("#totalCaja").html(data);
		        },
		        error: function() { alert('error al cargar el total de ventas '); },
		        beforeSend: App.setHeader
		});
},


/**
 * Cargar los datos de una tienda
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
loadTienda: function(tienda_id,nombre){

			$("#nombreTienda").text(nombre);
			$.ajax({            
			        url:  App.baseapiurl + "/movil/totalventastienda"+tienda_id,
			        type: 'GET',
			        dataType: 'json',
			        success: function(data) {
			           $("#detalleVentaDia").html(data);
			        },
			        error: function() { alert('error al cargar la tienda '); },
			        beforeSend: App.setHeader 
			});

			$.ajax({            
			        url:  App.baseapiurl + "/movil/totalcajatienda"+tienda_id,
			        type: 'GET',
			        dataType: 'json',
			        success: function(data) {
			           $("#detalleCajaDia").html(data);
			        },
			        error: function() { alert('error al cargar el total de la caja '); },
			        beforeSend: App.setHeader 
			});

	App.tienda_id = tienda_id;
	App.nombreTienda = nombre;

},
/**
 * Cargar la lista de las Ventas
 * @param {int} venta_id - El identificador de la venta
 */
getListadoVentas: function(){

			$("#nombreVentaTienda").text("ventas "+ App.nombreTienda);


    $.ajax({            
	        url:  App.baseapiurl + "/movil/ventas/" +App.tienda_id,
	        type: 'GET',
	        dataType: 'json',
	        success: function(data) {


	        	    $("#listarVentas").html("");
		            var lista = $("#listarVentas");
		            $.each(data, function(i,item){

		            	var html = "<li><a href='#detalleVenta' onclick='App.getDetalleVenta("+item.id+")' >" + App.tipoComprobante[item.tipoComprobante] +" "+  item.id + " - " + App.formaPago[item.formaPago] + " $ "+ item.total + "</li>";
		 												lista.append(html);
		            })
		           lista.listview('refresh');
	            
	        },
	        error: function() { alert('error al cargar el loadListaVentas) '); },
	        beforeSend: App.setHeader
	});
},

getListadoCajas:function(){

			$("#nombreCajaTienda").text("Cajas "+ App.nombreTienda);

		 $.ajax({            
			        url:  App.baseapiurl + "/movil/caja/" +App.tienda_id,
			        type: 'GET',
			        dataType: 'json',
			        success: function(data) {
			        	    $("#listarCajas").html("");
				            var lista = $("#listarCajas");
				            $.each(data, function(i,item){
				            	var html = "<li><a href='#detalleCaja' onclick='App.getDetalleCaja("+item.id+")'  > Caja " + item.id +"  "+ App.estadoCaja[item.estado] +" $ "+ item.monto  + "</li>";
				 												lista.append(html);
				            })
				           lista.listview('refresh');
			            
			        },
			        error: function() { alert('error al cargar el loadListaVentas) '); },
			        beforeSend: App.setHeader
			});

},

getDetalleVenta: function(boleta_id){
	App.boleta_id = boleta_id;
	$("#nombreBoleta").text("Boleta " +boleta_id);

	console.log("getDetalleVenta");
		 $.ajax({
	        url:  App.baseapiurl + "/movil/detalleventa/"+boleta_id,
         type: 'GET',
         dataType: 'json',
         success: function(data) { 
               $('#formaDePago').text(data.formaDePago);
               $('#total').text(data.total);
               $('#vendedor').text(data.vendedor);

               $.each(data.productos,function(i,item){
		               		 $("#listarProductos").html("");
						              var lista = $("#listarProductos");
						              $.each(data.productos, function(i,item){
						              console.log(item.codigo);
						            	    var html = "<li data-theme='c'><a data-transition='slide' href='#'>" + item.codigo +" - "+ item.nombre +" ("+ item.cantidad+ ")</li>";
						 												    lista.append(html);
						            })
						           lista.listview('refresh');
               });
                
         },
         error: function() { alert('no se puedo!'); },
              beforeSend: App.setHeader
   });    
},
getDetalleCaja: function(caja_id){
				App.caja_id = caja_id;
    $("#nombreCaja").text("Caja " +caja_id);
},

logout:function(){
    App.token = ""
},


setHeader : function(xhr){

    xhr.setRequestHeader("Authorization", "Token "+ App.token);
},
/**
 * Graficar El detalle de venta (google chart)
 */
drawChart: function(){
  console.log("drawChart");
       var data = google.visualization.arrayToDataTable([
          ['Tienda', 'ventas'],
          ['Temuco (Mall Mirage)', 1000   ],
          ['Temuco (Centro)',  1170     ],
          ['Puerto Montt (Costanera)', 660  ],
        ]);

        var options = {
          title: 'Ventas del dia por sucursal',
          hAxis: {title: 'HOY', titleTextStyle: {color: 'red'}}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);

},

};