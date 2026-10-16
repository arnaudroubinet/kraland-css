// Active tooltip

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Slide menu

$(function(){

$('#slide-submenu').on('click',function() {			        
	$(this).closest('.list-group').fadeOut('slide',function(){
		$('#col-left').toggleClass('col-md-1 col-md-3');
		$('#col-right').toggleClass('col-md-11 col-md-9');
		$('.mini-submenu').fadeIn();	
		});
	});
	
$('.mini-submenu').on('click',function(){		
	$(this).next('.list-group').toggle('slide');
	$('#col-left').toggleClass('col-md-3 col-md-1');
	$('#col-right').toggleClass('col-md-9 col-md-11');
	$('.mini-submenu').hide();
	})
});

// Navbar at the top

if( topbar == 0 )
{
$(document).ready(function(){
    $(window).bind('scroll', function() {
        var navHeight = $("#top").height();
        ($(window).scrollTop() > navHeight) ? $('nav').addClass('goToTop') : $('nav').removeClass('goToTop');
    });
});
}

// Button scroll to the top

if ( ($(window).height() + 100) < $(document).height() ) {
    $('#top-link').removeClass('hidden').affix({
        offset: {top:100}
    });
}

// expand/collapse panel

jQuery(function ($) {
	$('.panel-heading span.clickable').on("click", function (e) {
		if ($(this).hasClass('panel-collapsed')) {
			// expand the panel
			$(this).parents('.panel').find('.panel-body').slideDown();
			$(this).removeClass('panel-collapsed');
			$(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
		}
		else {
			// collapse the panel
			$(this).parents('.panel').find('.panel-body').slideUp();
			$(this).addClass('panel-collapsed');
			$(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
		}
	});
});

// show & hide elements

function showHide(sh) {
	if (document.getElementById(sh)) {
		if (document.getElementById(sh+'-show').style.display != 'none') {
			document.getElementById(sh+'-show').style.display = 'none';
			document.getElementById(sh).style.display = 'block';
		}
		else {
			document.getElementById(sh+'-show').style.display = 'inline';
			document.getElementById(sh).style.display = 'none';
		}
	}
}

// expand topics
// function displayTopic(id) {
//   document.getElementById(id).style.display = ( document.getElementById(id).style.display == 'none' ) ? '' : 'none';
// }

// Ajax

function htmlEntities(str) {
    return String(str).replace(/&/g, '%26').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, '%22');
}

function updateAjax( id, param, t )
{ 
	var req = null; 
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	} 
	else if (window.ActiveXObject) 
	{
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e)
		{
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
   	}
	req.onreadystatechange = function()
	{ 
		if(req.readyState == 4)
		{
			if(req.status == 200 )
			{
				document.getElementById(id).innerHTML  = req.responseText;
			}	
			else	
			{
				document.getElementById(id).innerHTML  ="Error: " + req.status + " " + req.statusText;
			}	
		} 
		$('[data-toggle="tooltip"]').tooltip();
	}; 
	req.open("GET", "ajx/"+param+"-"+new Date().getTime()+"/"+t, true); 
	req.send(null); 
}

function updateAjaxPost( id, param, t, message, name )
{ 
	message = htmlEntities( message );
	var req = null; 
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	} 
	else if (window.ActiveXObject) 
	{
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e)
		{
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
   	}
	req.onreadystatechange = function()
	{ 
		if(req.readyState == 4)
		{
			if(req.status == 200 )
			{
				document.getElementById(id).innerHTML  = req.responseText;
			}	
			else	
			{
				document.getElementById(id).innerHTML  ="Error: " + req.status + " " + req.statusText;
			}	
		} 
		$('[data-toggle="tooltip"]').tooltip();
	};
	params="c[1]="+name+"&message="+message;
	req.open("POST", "ajx/"+param+"-"+new Date().getTime()+"/"+t, true); 
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Content-length", params.length);
	req.setRequestHeader("Connection", "close");
	req.send(params); 
}

function spoiler(object)
{
	if( object.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '' )
	{
		object.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';
		object.innerText = ''; 
		object.value = '^';
	} 
	else
	{
		object.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none';
		object.value = 'v';
	}
}

//check all

function checkAll()
{
	for (var i=0;i<document.list_msg.elements.length;i++)
	{
		var e=document.list_msg.elements[i];
		if( e.name == "n[]" )
		{
			e.checked=document.list_msg.allbox.checked;
		}
	}
}

//open map

function openMap( map ) 
{ 
	window.open( "map"+( map ? "/"+map : "" ),"Cybermonde","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=1040,height=660")
}

//open private report

function openReport( link )
{
	window.open('report'+( link ? "/"+link : "" ),'private_report','width=600,height=600,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes,resizable=yes');
}

//open help

function openHelp( part ) 
{ 
	window.open( "help"+( part ? "/"+part : "" ),"Aide","toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=800,height=480")
}
