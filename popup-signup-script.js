const button = document.querySelector('button');

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.transform = 'scale(1.3)';

    document.querySelector('form').style.backgroundColor = '#1abc9c';

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'black';
        input.style.color = 'white';
        input.style.transform = 'scale(0.7)';
    });
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#f5c2e0';
    button.style.color = 'black';
    button.style.transform = 'scale(1)';

    document.querySelector('form').style.backgroundColor = '#16a085';

    document.querySelector('#email').classList.remove('white_placeholder');
    document.querySelector('#password').classList.remove('white_placeholder');

    document.querySelectorAll('input').forEach(input => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.transform = 'scale(1)';
    });
});

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const first = document.querySelector('#firstName').value;
    const last = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
    const passVerify = document.querySelector('#passwordVerify').value;
    console.log("Name: " + first + " | Last: " + last + " | Email: " + email + " | Pass: " + pass + " | RePass: " + passVerify);

    //Check if passwords match, then send information to server. Inform user of invalid information.
    if (pass === passVerify) {
        if (checkPass(pass)) {
            console.log("Match");
            if (first && last && email && pass && passVerify) {
                console.log("Form Valid");
                
                chrome.runtime.sendMessage({message: 'signup', payload: {first, last, email, pass} }, function(response) {
                    if (response === 'success') window.location.replace('./popup-tandc.html');
                    else {console.log(response)};
                }); 
            } else {
                document.querySelector('#email').placeholder = "Enter an email.";
                document.querySelector('#password').placeholder = "Enter a password.";
                document.querySelector('#email').style.backgroundColor = 'red';
                document.querySelector('#password').style.backgroundColor = 'red';
                document.querySelector('#email').classList.add('white_placeholder');
                document.querySelector('#password').classList.add('white_placeholder');
            }
        } else {
            document.querySelector('#password').value = "Too short";
            document.querySelector('#passwordVerify').value = "";
        } 
    } else {
        console.log("No Match");
        document.querySelector('#passwordVerify').placeholder = "Does not match";
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#passwordVerify').style.backgroundColor = 'red';
        document.querySelector('#password').value = "";
        document.querySelector('#passwordVerify').value = "";
    }
});

function checkPass(pass1) {
    if (pass1.length > 7 ) {
        return true;
    } else {
        return false;
    }

}