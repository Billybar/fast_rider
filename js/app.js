$(document).ready(function () {
  ride_id = ''
  $('footer').hide()
  $.get("http://fast-rider.herokuapp.com/api/v1/rides?token=433898df4a3e992b8411004109e4d574a90695e39e&api_key=433898df4a3e992b8411004109e4d574a90695e39e", function (data, status) {
    if (status == 'success') {
      var dataLen = data.length
      for (var x = 0; x < dataLen; x++) {
        onlyHour(data[x].return_time)

        /* Creating a Ride Box   -  postion's of following var's
        
                         div_1 (Entire Box)       
                |======================================|
                |                div_2                 |
                |--------------------------------------|
                |                <btn>                 | 
                |                               p_1    |  
                |--------------------------------------|
                |                                      |
                |                 h3                   |
                |                                      |
                |--------------------------------------|
                |                div_3                 |
                |     {p_3_1              p_3_2}       |
                |--------------------------------------|
                |               </btn>                 |
                |======================================|
        */

        var div_1 = $('<div></div>').attr('class', 'col-6 col-md-3 py-2 px-1')
        var div_2 = $('<div></div>').attr('class', 'top').css('background-color', data[x].zone.color)
        var div_3 = $('<div></div>').attr('class', 'pb-4 px-2')
        var p_1 = $('<p></p>').attr('class', 'text-right pr-1 b').text(data[x].zone.name)
        var h3 = $('<h3></h3>').attr('class', 'ride py-3').text(data[x].name)
        var p_3_1 = $('<p></p>').attr('class', 'float-left m-0 b').text(time)
        var p_3_2 = $('<p></p>').attr('class', 'float-right m-0 pb-2 b').text(data[x].remaining_tickets)
        var img_3_1 = $("<img>").attr({
          'class': 'pr-1 pb-1 myWid',
          'src': 'img/ico-g-01.svg',
          'alt': 'Parking ticket'
        })
        var img_3_2 = $("<img>").attr({
          'class': 'pr-1 pb-1 myWid',
          'src': 'img/ico-g-03.svg',
          'alt': 'Clock'
        })
        var btn = $('<button></button>').attr({
          'id': data[x].id,
          'onclick': 'pressBtn(id)',
          'class': 'box'
        })

        $(p_3_1).prepend(img_3_2)
        $(p_3_2).prepend(img_3_1)
        $(div_3).prepend(p_3_1, p_3_2)
        $(btn).prepend(p_1, h3, div_3)
        $(div_1).prepend(div_2, btn)
        $('#boxRow').prepend(div_1)
      }

    } else {
      errorMessage('Eroor: Check Internet connection')
    }

  });
});


// Get DATE-TIME - return Hour
function onlyHour(dateTime) {

  var date = new Date(dateTime)
  var hour = date.getHours()
  var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  time = hour + ':' + minutes
  return time
}


// After User Choose the ride 
function pressBtn(id) {

  $('.box').css('background-color', '#373737');
  document.getElementById(id).style.backgroundColor = document.getElementById(id).previousSibling.style.backgroundColor
  // var check = true
  ride_id = id
  return ride_id
}

//* Once User press SUBMIT   
$(".myBtn").click(function () {
  if (ride_id == 0) {
    errorMessage('Please Choose a Ride')
  } else {
    var pin = $("input").val();
    var url = 'http://fast-rider.herokuapp.com/api/v1/tickets';
    var data = {
      pin,
      ride_id,
      token: '433898df4a3e992b8411004109e4d574a90695e39e'
    }

    $.post(url, data, function (res, status) {
      if (status == 'success') {
        onlyHour(res.return_time)

        var thanksDiv = $('<div></div>').attr('class', 'col-12 col-md-4 px-4 px-md-0 pb-5 pb-md-0')
        var thanksP = '<p><b>Thank you for using The Jungle<sup>TM</sup> FastRider ticket system - your access code is now ready!</b></p>'
        var thanksImg = $('<img>').attr({
          'class': 'imgLg',
          'src': 'img/ico-04.svg',
          'alt': 'Navigate'
        })
        $(thanksDiv).prepend(thanksImg, thanksP)

        var div__1 = $('<div></div>').attr('class', 'col-12 col-md-6')
        var div__2 = $('<div></div>').attr('class', 'top').css('background-color', res.ride.zone.color)
        var div__3 = $('<div></div>').attr('class', 'box')
        var div__4 = $('<div></div>')
        var p__4_1 = $('<p></p>').attr('class', 'float-left p-1 pl-2 white b').text(res.ride.name)
        var p__4_2 = $('<p></p>').attr('class', 'float-right p-1 pr-2 b').text(res.ride.zone.name)
        var div__5 = $('<div></div>').attr('class', 'pt-5')
        var p__5_1 = $('<p></p>').attr('class', 'mb-0 b').text('Return At')
        var h3__5_2 = $('<h3></h3>').text(time)
        var div__6 = $('<div></div>')
        var p__6_1 = $('<p></p>').attr('class', 'mb-0 b').text('Use Access Code')
        var h3__6_2 = $('<h3></h3>').text(res.access_code)

        $(div__6).prepend(p__6_1, h3__6_2)
        $(div__5).prepend(p__5_1, h3__5_2)
        $(div__4).prepend(p__4_1, p__4_2)
        $(div__3).prepend(div__4, div__5, div__6)
        $(div__1).prepend(div__2, div__3)

        // Fading effect
        $('#icoRow').fadeOut()
        $('#boxRow').fadeOut()
        $('#inputRow').fadeOut()
        $('footer').fadeOut()

        // render POST response
        $('#icoRow').html(thanksDiv)
        $('#icoRow').fadeIn()
        $('#boxRow').html(div__1)
        $('#boxRow').fadeIn()

      } else {
        errorMessage('Eroor: Check Internet connection')
      }
    });
  }
});


// Error Message
function errorMessage(message) {

  $("#divAlert").fadeToggle('slow');
  $("#errorPara").html(message)
  setTimeout(function () {
    $("#divAlert").fadeOut(3000);
  }, 3000)
}

// Add submit button In Moblie mode
$("input").mouseenter(function () {
  $('footer').fadeIn()
});


// Input validatin
$('.myBtn').click(function () {
  if (!($('input').val().length == 15)) {
    $('input').val('')
    $('input').attr("placeholder", "**Invaild #PIN")
  }
});