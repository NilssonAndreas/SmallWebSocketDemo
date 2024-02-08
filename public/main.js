document.addEventListener('DOMContentLoaded', function() {
    let socket = io();

    const sendMessageButton = document.getElementById('sendMessage');
    // Handle incoming user list updates
    socket.on('userList', function(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = '<option value="">Select a user</option>'; // Reset list
        users.forEach(id => {
            if (id !== socket.id) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = `User ${id}`;
                userList.appendChild(option);
            }
        });
    });
    // Listen for incoming messages
    socket.on('message', function(message) {
        const messagesDiv = document.getElementById('messages'); 
        if (messagesDiv) { 
            const messageElement = document.createElement('p'); 
            messageElement.textContent = `${message.sender}: ${message.content}`; 
            messagesDiv.appendChild(messageElement); 
        } else {
            console.error('The messages container div was not found.');
        }
    });

    sendMessageButton.addEventListener('click', function() {
        const messageInput = document.getElementById('messageInput');
        const recipient = document.getElementById('userList').value;
        if (messageInput.value.trim() && recipient) {
            socket.emit('sendMessage', {
                content: messageInput.value,
                recipient: recipient,
                sender: `User ${socket.id}`
            });
            messageInput.value = ''; // Clear input
        }
    });
});
