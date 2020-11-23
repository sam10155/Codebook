console.log("background script running...");

let user_signed_in = false;
let return_session = false;

const server = "http://isaacmorton.ca:1111";

function is_user_signed_in() {
	return new Promise(resolve => {
		chrome.storage.local.get(['userStatus', 'user_info'], function (response) {
			if (chrome.runtime.lastError) resolve({userStatus: false, user_info: {} })

			resolve(
				response.userStatus === undefined ?
					{userStatus: false, user_info: {} } :
					{userStatus: response.userStatus, user_info: response.user_info }
			)
		})
	})
}

function flip_user_status(signIn, user_info) {
    if (signIn) {
        return fetch(server + '/login', {
            method: 'GET',
            headers: {
                'Authorization': btoa(`${user_info.email}:${user_info.pass}`)
            }
        })
            .then(res => {
				console.log(res);
                return new Promise(resolve => {
                    if (res.status !== 200) resolve('fail')

                    chrome.storage.local.set({ userStatus: signIn, user_info }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');

                        user_signed_in = signIn;
                        resolve('success');
                    });
                })
            })
            .catch(err => console.log(err));
    }  else if (!signIn) {
		// fetch the localhost:3000/logout route
		return new Promise(resolve => {
			chrome.storage.local.get(['userStatus', 'user_info'], function (response) {
				console.log(response);
				if (chrome.runtime.lastError) resolve('fail');
	
				if (response.userStatus === undefined) resolve('fail');
	
				fetch(server + '/logout', {
					method: 'GET',
					headers: {
						'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
					}
				})
				.then(res => {
					console.log(res);
					if (res.status !== 200) resolve('fail');
	
					chrome.storage.local.set({ userStatus: signIn, user_info: {} }, function (response) {
						if (chrome.runtime.lastError) resolve('fail');
	
						user_signed_in = signIn;
						resolve('success');
					});
				})
				.catch(err => console.log(err));
			});
		});
	}
}

is_user_signed_in()
	.then(res => {
		if (res.userStatus) return_session = true;

		user_signed_in = res.userStatus;
	})
.catch(err => console.log(res));

function newUser(newUser_info) {
	var data = {
		firstname: newUser_info.first,
		lastname: newUser_info.last,
		email: newUser_info.email,
		password: newUser_info.pass
	};
	console.log(data);
	return fetch(server + '/newUser', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(res => {
				console.log(res);
                return new Promise(resolve => {
                    if (res.status !== 200) resolve('fail')

                    chrome.storage.local.set({ newUser: newUser_info }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');

                        resolve('success');
                    });
                })
            })
            .catch(err => console.log(err));
}

function addCombination(new_info) {
	var data = {
		sitename: new_info.sitename,
		siteurl: new_info.siteurl,
		username: new_info.user,
		password: new_info.pass
	};

	return new Promise(resolve => {
		chrome.storage.local.get(['user_info'], function (response) {
			console.log(response);
			//if (chrome.runtime.lastError) resolve('fail');

			fetch(server + '/addCombination', {
				method: 'POST',
				headers: {
					'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
				},
				body: JSON.stringify(data)
			})
			.then(res => {
				console.log(res);
				if (res.status !== 200) resolve('fail');

				resolve('success');
			})
			.catch(err => console.log(err));
		})
	});
}

function requestCombination(sitename_search) {
	var data = {
		sitename: sitename_search.sitename,
	};

	return new Promise(resolve => {
		chrome.storage.local.get(['user_info'], function (response) {
			//console.log(response);
			//if (chrome.runtime.lastError) resolve('fail');

			fetch(server + '/requestCombination', {
				method: 'POST',
				headers: {
					'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
				},
				body: JSON.stringify(data)
			})
			.then(res => res.json().then(data => {
				console.log(res);
				if (res.status !== 200) resolve('fail');

				const currun = data.username;
				const currps = data.password;

				chrome.storage.local.set({ currun, currps }, function (response) {
					if (chrome.runtime.lastError) resolve('fail');

					resolve('success');
				});
			}))
			.catch(err => console.log(err));
		})
	}); 	
}

function editUsername(username_change) {
	var data = {
		sitename: username_change.sitename,
		username: username_change.username_new
	};

	return new Promise(resolve => {
		chrome.storage.local.get(['user_info'], function (response) {
			//console.log(response);
			//if (chrome.runtime.lastError) resolve('fail');

			fetch(server + '/editUsername', {
				method: 'POST',
				headers: {
					'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
				},
				body: JSON.stringify(data)
			})
			.then(res => {
				console.log(res);
				if (res.status !== 200) resolve('fail');

				resolve('success');
			})
			.catch(err => console.log(err));
		})
	});
}

function editPassword(password_change) {
	var data = {
		sitename: password_change.sitename,
		password: password_change.password_new
	};

	return new Promise(resolve => {
		chrome.storage.local.get(['user_info'], function (response) {
			//console.log(response);
			//if (chrome.runtime.lastError) resolve('fail');

			fetch(server + '/editPassword', {
				method: 'POST',
				headers: {
					'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
				},
				body: JSON.stringify(data)
			})
			.then(res => {
				console.log(res);
				if (res.status !== 200) resolve('fail');

				resolve('success');
			})
			.catch(err => console.log(err));
		})
	});
}


function loadSitenames () {
	return new Promise(resolve => {
		chrome.storage.local.get(['user_info'], function(response) {
			if (chrome.runtime.lastError) resolve('fail');

			fetch(server + '/sitenamelist', {
				method: 'POST',
				headers: {
					'Authorization': btoa(`${response.user_info.email}:${response.user_info.pass}`)
				}
			})
			.then(res => res.json().then(data => {
				console.log(res);
				if (res.status !== 200) resolve('fail');

				const sitenamelist = data;

				chrome.storage.local.set({ sitenamelist }, function (response) {
					if (chrome.runtime.lastError) resolve('fail');

					resolve('success');
				});
			}))
			.catch(err => console.log(err));
		})
	}); 	
}

chrome.browserAction.onClicked.addListener(function () {
	console.log("Button Clicked!");
	is_user_signed_in()
		.then(res => {
			if (res.userStatus) {
				if (return_session) {
					// Welcome back
					
				} else {
					// sign-out
				}
			} else {
				// sign-in
			}
		})
}); 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if(request.message === 'login'){
		flip_user_status(true, request.payload)
		.then(res => sendResponse(res))
		.catch(err => console.log(err));

		return true;
	} else if (request.message === 'logout') {
		flip_user_status(false, null)
		.then(res => sendResponse(res))
		.catch(err => console.log(err));

		return true;
	} else if (request.message === 'signup') {
		newUser(request.payload)
		.then(res => sendResponse(res))
		.catch(err => console.log(err));
		
		return true;
	} else if (request.message === 'addCombination') {
		addCombination(request.payload)
		.then(res => sendResponse(res))
		.catch(res => console.log(res));

		return true;
	} else if (request.message === 'requestCombination') {
		requestCombination(request.payload)
		.then(res => sendResponse(res))
		.catch(res => console.log(res)); 

		return true;
	} else if (request.message === 'loadsitenames') {
		loadSitenames()
		.then(res => sendResponse(res))
		.catch(res => console.log(res));

		return true;
	} else if (request.message === 'editUsername') {
		editUsername(request.payload)
		.then(res => sendResponse(res))
		.catch(res => console.log(res));

		return true;
	} else if (request.message === 'editPassword') {
		editPassword(request.payload)
		.then(res => sendResponse(res))
		.catch(res => console.log(res));

		return true;
 	} else if (request.message === 'userStatus') {

	}
});