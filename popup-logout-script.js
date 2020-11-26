const addCombination_btn = document.querySelector('#addCombination_btn');
const showInfo_btn = document.querySelector('#showInfo_btn');
const editUser_btn = document.querySelector('#editUser_btn');
const editPass_btn = document.querySelector('#editPass_btn');
const signOut_btn = document.querySelector('#signOut_btn');

const searchBar = document.getElementById('searchBar');
let siteNameList = [];

signOut_btn.addEventListener('mouseover', () => {
   signOut_btn.style.backgroundColor = 'black';
   signOut_btn.style.color = 'white';
   signOut_btn.style.transform = 'scale(1.3)';

   document.querySelector('div').style.backgroundColor = '#1abc9c';
});

signOut_btn.addEventListener('mouseleave', () => {
   signOut_btn.style.backgroundColor = '#f5c2e0';
   signOut_btn.style.color = 'black';
   signOut_btn.style.transform = 'scale(1)';

   document.querySelector('div').style.backgroundColor = '#16a085';
});

showInfo_btn.addEventListener('click', () => {
    const sitename = document.querySelector('#searchBar').value.toLowerCase();
    console.log(sitename);

    chrome.runtime.sendMessage({message: 'requestCombination', payload: {sitename} }, function(response) {
        if (response === 'success') {
            chrome.storage.local.get(['currun', 'currps'], function(data) {
                console.log(data);

                document.querySelector('#currentUsername').value = data.currun;
                document.querySelector('#currentPassword').value = data.currps;
            });
        }
        else document.querySelector('#searchBar').value = "No combination found...";
    });
});

addCombination_btn.addEventListener('click', () => {
    // log form info
    const sitename = document.querySelector('#sitename').value;
    const siteurl = document.querySelector('#siteurl').value;
    const user = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;

    if (sitename && siteurl && user && pass) {
        chrome.runtime.sendMessage({message: 'addCombination', payload: {sitename, siteurl, user, pass} }, function(response) {
            if (response === 'success') {
                loadSitenames();
                window.location.reload();
            } else {
                //display failed
            }
        });
    } else {
        //display invlaid
    }
});

editUser_btn.addEventListener('click', () => {
    const username = document.querySelector('#currentUsername').value;
    const username_new = document.querySelector('#newUsername').value;
    const sitename = document.querySelector('#searchBar').value;

    if (username && username_new) {
        if (username !== username_new) {
            chrome.runtime.sendMessage({message: 'editUsername', payload: {sitename, username_new} }, function(response) {
                if (response === 'success') {
                    document.querySelector('#newUsername').value = "Username edited";
                    document.querySelector('#currentUsername').value = username_new;
                }
            });
        } else {
            //do somthing
        }
        
    }else {
        //do something
    }

});

editPass_btn.addEventListener('click', () => {
    const password = document.querySelector('#currentPassword').value;
    const password_new = document.querySelector('#newPassword').value;
    const sitename = document.querySelector('#searchBar').value;

    if (password && password_new) {
        if (password !== password_new) {
            if (checkPass(password_new)) {
                chrome.runtime.sendMessage({message: 'editPassword', payload: {sitename, password_new} }, function(response) {
                    if (response === 'success') 
                    {
                        document.querySelector('#newPassword').value = "Password edited";
                        document.querySelector('#currentPassword').value = password_new;
                    }
                });
            } else {
                document.querySelector('#newPassword').value = "Too short";
            }  
        } else {
            //do somthing
        }
        
    }else {
        //do something
    }

});

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredList = siteNameList.filter((word) => {
        return (
            word.includes(searchString)
        );
    });
    
    //console.log(filteredList)
    displaySitenames(filteredList);
});

function checkPass(pass1) {
    if (pass1.length > 7 ) {
        return true;
    } else {
        return false;
    }

}

function loadSitenames() {
    chrome.runtime.sendMessage({message: 'loadsitenames' }, function(response) {
        if (response === 'success') {
            chrome.storage.local.get(['sitenamelist'], function(data) {
                console.log(data);

                const buffer = Object.entries(data); 
                siteNameList = buffer[0][1];
                displaySitenames(siteNameList);
            });
        }
    });  
}

function displaySitenames(listArray) {
    document.getElementById("sitenames").innerHTML = "";
    for (var key in listArray) {
        var optionElement = document.createElement("option");
        optionElement.value = listArray[key];
        document.getElementById("sitenames").appendChild(optionElement);
    }
}

signOut_btn.addEventListener('click', () => {
   //send message to background telling backround to delete their credentials
   chrome.runtime.sendMessage({ message: 'logout' }, function(response) {
      if (response === 'success') window.location.replace('./popup-login.html');
   });
});

loadSitenames();