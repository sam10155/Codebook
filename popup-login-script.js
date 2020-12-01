const signinButton = document.querySelector(`button[name='signin']`);
const signupButton = document.querySelector(`button[name='signup']`);


signinButton.addEventListener('mouseover', () => {
    signinButton.style.backgroundColor = 'black';
    signinButton.style.color = 'white';
    signinButton.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#1abc9c';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

signinButton.addEventListener('mouseleave', () => {
    signinButton.style.backgroundColor = '#f5c2e0';
    signinButton.style.color = 'black';
    signinButton.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#16a085';

    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});

signupButton.addEventListener('mouseover', () => {
    signupButton.style.backgroundColor = 'black';
    signupButton.style.color = 'white';
    signupButton.style.transform = 'scale(1.3)';
});

signupButton.addEventListener('mouseleave', () => {
    signupButton.style.backgroundColor = '#f5c2e0';
    signupButton.style.color = 'black';
    signupButton.style.transform = 'scale(1)';
});

signupButton.addEventListener('click', event => {
    window.location.replace('./popup-signup.html');
});

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    if (email && password) {
        //send message to background script with email and password
        chrome.runtime.sendMessage({message: 'login', payload: {email, pass} }, function(response) {
            if (response === 'success') window.location.replace('./popup-logout.html');
        });
    } else {
        document.querySelector('#email').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#email').value = "Does not match";
        document.querySelector('#email').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#email').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    }
});