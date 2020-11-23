const button = document.querySelector('button');
const checkBox = document.querySelector('#cb');

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.transform = 'scale(1.3)';
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#f5c2e0';
    button.style.color = 'black';
    button.style.transform = 'scale(1)';
});

//Check of Checkbox is checked then goto main page
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    if (checkBox.checked) window.location.replace('./popup-login.html');
    else {
        document.querySelector('span').style.color = 'red';
    }    
});