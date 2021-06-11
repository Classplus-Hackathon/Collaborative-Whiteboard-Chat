var socket = io();
//scroll fn
const params = (new URL(location)).searchParams;
function scrollToBottom() {
  //selectors
  var messages = jQuery('#messages');
  // var messagesmessagesagain = jQuery('#messagesagain');
  //selecting last msg
  var newMessage = messages.children('li:last-child')
  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.innerHeight();
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

var isActive = true;

$().ready(function () {
  console.log("http://localhost:8000/?room=MYID&name=HaHA");
  //EITHER USE A GLOBAL VAR OR PLACE VAR IN HIDDEN FIELD
  //IF FOR WHATEVER REASON YOU WANT TO STOP POLLING
  pollServer();
});

function pollServer() {
  if (isActive) {
    window.setTimeout(function () {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      $.ajax({
        url: `/fetchTrending?room=${params.room}`,
        type: "GET",
        success: function (result) {
          //SUCCESS LOGIC
          var template = jQuery('#message-template').html();
          result.data.forEach(function (message) {
            var html = Mustache.render(template, {
              text: message,
              from: "TRENDING",
            });
            jQuery('#messages-again').append(html);
          });
            pollServer();
            setTimeout(() => {
              $("#chat__messages_trend ol").html("");
            },5000)
            
          },
            error: function () {
              //ERROR HANDLING
              pollServer();
            }});
    }, 5000);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  if (window.sessionStorage.getItem("messages")) {
    var tempAray = JSON.parse(window.sessionStorage.getItem("messages"));
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    var template = jQuery('#message-template').html();
    let welcomeOnce = false;
    tempAray.forEach(function (message) {
      if (params.name === message.from) {
        template = jQuery('#message-template-same').html();
      }
      else {
        template = jQuery('#message-template').html();
      }
      var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createAt: message.createAt
      });
      jQuery('#messages').append(html);
      scrollToBottom();
    });


  } else {
    window.sessionStorage.setItem("messages", JSON.stringify([]));
  }
  socket.emit('join', params, function (err) {
    if (err) {
      // alert(err);
      //  window.location.href = '/';
    } else {
      console.log('no error');
    }
  })
});

socket.on('disconnect', function () {

  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {

  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  var template = jQuery('#message-template').html();
  if (message.from !== "Admin" && params.name === message.from) {
    template = jQuery('#message-template-same').html();
  }
  var formattedTime = moment(message.createAt).format('h:mm a')
  var payload = {
    text: message.text,
    from: message.from,
    createAt: formattedTime
  }
  var arrayMessage = JSON.parse(window.sessionStorage.getItem("messages"));
  arrayMessage = [...arrayMessage, payload];
  window.sessionStorage.setItem("messages", JSON.stringify(arrayMessage));
  var html = Mustache.render(template, {
    text: message.text,
    from: (params.name === message.from) ? "You" : message.from,
    createAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {

  var formattedTime = moment(message.createAt).format('h:mm a')
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();

});

jQuery('#message-form').on('submit', function (e) {

  e.preventDefault();
  var messageTextBox = jQuery('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...')
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled');
    alert('Unable to fetch location.');
  });
});