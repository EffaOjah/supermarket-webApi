function showToast(message, color) {
    iziToast.show({
        title: message,
        titleColor: 'rgb(20, 20, 30)',
        // message: 'Testing Toast',
        color: color, // blue, red, green, yellow
        position: 'topRight',
    });
}

function showResponseMessage() {
    var message = document.getElementById('message').innerHTML;
    var messageColor = document.getElementById('messageColor').innerHTML;

    message = message.trim();
    messageColor = messageColor.trim();

    if (messageColor.includes('red') || messageColor.includes('green')) {
        showToast(message, messageColor);
        return
    }
}

showResponseMessage();