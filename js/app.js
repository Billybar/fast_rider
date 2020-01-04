// -------------------------------------- ON-LOAD
$(document).ready(function () {

  ride_id = ''
  var value = localStorage.key(0)
  if (value) {
    $('input').val(value)
  } else {
    $('footer').hide()
  }

  var getUrl = "http://fast-rider.herokuapp.com/api/v1/rides?token=433898df4a3e992b8411004109e4d574a90695e39e&api_key=433898df4a3e992b8411004109e4d574a90695e39e"
  getRequest(getUrl)
});



//--------------------------------- ONCE USER CHOOSE A RIDE 
function pressBtn(id) {

  id = parseInt(id)
  var pId = id + 30
  let remanTickect = document.getElementById(pId).textContent
  if (remanTickect == 0) {
    document.getElementById(id).innerHTML = 'No Tickets Left for this ride'
    document.getElementById(id).style.color = '#f0f8ff91'
  } else {
    $('.box').css('background-color', '#373737');
    document.getElementById(id).style.backgroundColor = document.getElementById(id).previousSibling.style.backgroundColor
    ride_id = id
    return ride_id
  }
}




//------------------------------------ ONCE USER SUBMIT   
$(".myBtn").click(function () {

  var check = validation()
  if (check) {
    var url = 'http://fast-rider.herokuapp.com/api/v1/tickets';
    var data = {
      pin,
      ride_id,
      token: '433898df4a3e992b8411004109e4d574a90695e39e'
    }
    var check2 = validation2(pin)
    if (check2) {
      postRequest(url, data, pin)
    }
  }
});


function getRequest(getUrl) {

  $.get(getUrl, function (data, status) {
    if (status == 'success') {
      createBox(data)
    } else {
      errorMessage('Eroor: Check Internet connection')
    }
  });
}



function postRequest(url, data, pin) {

  $.post(url, data, function (res, status) {
    if (status == 'success') {
      createPostResponePage(res)
      storagePin(pin)
    } else {
      errorMessage('Eroor: Check Internet connection')
    }
  });
}



function validation() {

  currentHour = new Date()
  currentHour = onlyHour(currentHour)
  if (currentHour < '09:00' || currentHour > '21:00') {
    errorMessage('System availabe only  9:00 - 19:00')
  } else if (ride_id == 0) {
    errorMessage('Please Choose a Ride')
  } else {
    pin = $("input").val()
    var check = checkPin(pin)
    if (!check) {
      $('input').val('').attr("placeholder", "*Invaild PIN")
    }
    return check
  }
}


function validation2(pin) {

  var now = Date.now()
  var pinDate = parseInt(localStorage.getItem(pin + ' date'))
  if (now - pinDate > 43200000) { // in milisecond = 12 Hours
    localStorage.removeItem(pin)
  }
  if (localStorage.getItem(pin) && currentHour <= localStorage.getItem(pin)) {
    errorMessage('Can order only one Ticket at a time')
    return false
  } else {
    return true
  }
}


function onlyHour(dateTime) {

  var date = new Date(dateTime)
  var hour = (date.getHours() < 10 ? '0' : '') + date.getHours()
  var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  time = hour + ':' + minutes
  return time
}


function checkPin(pin) {

  if (pin.startsWith('JN-') && pin.length == 15) {
    pinLoop(pin)
    if (!(letter === pin.charAt(13))) {
      return false
    }
    pinLoop(pin, 8, 1)
    if (!(letter == pin.charAt(14))) {
      return false
    }
    return true
  } else {
    return false
  }
}


function pinLoop(pin, digit = 3, modulo = 0) {

  var total = 0
  for (let x = digit; x <= (digit + 3); x++) {
    let num = pin.charAt(x)
    num = parseInt(num)
    if (x % 2 == modulo) {
      num *= 2
      if (num > 9) {
        num = String(num)
        let numB = num.charAt(1)
        numB = parseInt(numB)
        num = 1 + numB
      }
    }
    total += num
  }
  letter = String.fromCharCode(total % 26 + 65)
  return letter
}


function storagePin(pin) {

  var userPin = pin
  var userPinDate = pin + ' date'
  var now = Date.now()
  localStorage.setItem(userPin, time)
  localStorage.setItem(userPinDate, now)
}


function errorMessage(message) {

  $("#divAlert").fadeToggle('slow');
  $("#errorPara").html(message)
  setTimeout(function () {
    $("#divAlert").fadeOut(3000);
  }, 3000)
}



function createBox(data) {

  var dataLen = data.length
  for (var x = 0; x < dataLen; x++) {
    onlyHour(data[x].return_time)
    var div_1 = $('<div></div>').attr('class', 'div_1 col-6 col-md-3 px-1')
    var div_2 = $('<div></div>').attr('class', 'top').css('background-color', data[x].zone.color)
    var div_3 = $('<div></div>').attr('class', 'p-1')
    var p_1 = $('<p></p>').attr('class', 'text-right p_1 mb-0 pt-1 px-1 b').text(data[x].zone.name)
    var h3 = $('<h3></h3>').attr('class', 'ride px-md-2 py-3').text(data[x].name)
    var p_3_1 = $('<p></p>').attr({
      'class': 'float-left pl-1 pb-1 m-0 b',
      'id': data[x].id + 40
    }).text(time)
    var p_3_2 = $('<p></p>').attr({
      'class': 'float-right m-0 pr-1 pb-1 b',
      'id': (data[x].id + 30)
    }).text(data[x].remaining_tickets)
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
}



function createPostResponePage(res) {

  onlyHour(res.return_time)
  var thanksDiv = $('<div></div>').attr('class', 'col-12 col-md-6 px-4 pb-md-2')
  var thanksP = '<p class="px-md-3"><b>Thank you for using The Jungle<sup class="supP">TM</sup> FastRider ticket system - your access code is now ready!</b></p>'
  var thanksImg = $('<img>').attr({
    'class': 'thnIM',
    'src': 'img/ico-04.svg',
    'alt': 'Navigate'
  })
  $(thanksDiv).prepend(thanksImg, thanksP)

  var div__1 = $('<div></div>').attr('class', 'col-12 col-md-6 pt-3 pt-md-0')
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

  $('#inputRow').fadeOut(10)
  $('footer').fadeOut(10)
  $('#icoRow').html(thanksDiv)
  $('#icoRow').fadeIn()
  $('#boxRow').html(div__1)
  $('#boxRow').fadeIn()
}


$("input").mouseenter(function () {
  $('footer').fadeIn()
});