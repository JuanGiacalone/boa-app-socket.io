$(function () {
 
    // se obtiene de la variable usuario de la ruta 
    window.$_GET = new URLSearchParams(location.search);
    var username = $_GET.get('nombre');
    console.log(username);
    // direccion del servidor de node.js 
    var url = 'localhost:5501';
    //conexion del socket
    var socket = io.connect(url, { transports: ['websocket']});

  //variables del dom

    // ul de mensajes
    var $messages = $('.messages');

    //ventana de la web
    var $window = $(window);

    //input de texto
    var $inputMsg = $('#m');

    //boton enviar msj
    var $sendButton = document.getElementById("sendButton");

    //msg-body-chats
    var $msgBodychats = document.getElementsByClassName("msg-body-chats");

    //sanitizante de texto
    const cleanInput = (input) => {
      return $('<div/>').text(input).html();
        }

    socket.emit('add user',username);

   /* $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      console.log(e);
      sendMessage();
      return false;
    });*/
    
   

    // Sends a chat message
  const sendMessage = () => {
    event.preventDefault();
    var message = $inputMsg.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {   //&& connected
      $inputMsg.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }
    socket.on('new message', (data) => {
      addChatMessage(data);
    });


     // Keyboard events

     // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
      // Don't fade the message in if there is an 'X was typing'
      
  
      var $usernameDiv = $('<span class="username"/>')
        .text(data.username)
        .css('color', 'red');
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);
  
     
      var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .append($usernameDiv, $messageBodyDiv);
      
      addMessageElement($messageDiv, options);
      $msgBodychats[0].scrollTop = $msgBodychats[0].scrollHeight;
    }
    const addMessageElement = (el, options) => {
      var $el = $(el);
  
      // Setup default options
      if (!options) {
        options = {};
      }
  
      // Apply options
      if (options.fade) {
        $el.hide().fadeIn(FADE_TIME);
      }
      if (options.prepend) {
        $messages.prepend($el);
      } else {
        $messages.append($el);
      }
      $messages[0].scrollTop = $messages[0].scrollHeight;
      
    }

  // agrego evento al boton enviar
  $sendButton.addEventListener("click",function(event){event.preventDefault(); sendMessage(); });


  //agrego evento a la tecla enter y autofocus al input
  $window.keydown(event => {
   
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $inputMsg.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      event.preventDefault();
        sendMessage();
    }
  });
  
    



  /*
    const sendMessage = () => {
      var message = $inputMessage.val();
      // Prevent markup from being injected into the message
      message = cleanInput(message);
      // if there is a non-empty message and a socket connection
      if (message && connected) {
        $inputMessage.val('');
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
      }
    }*/


    // sanitizante de texto 
    
});
