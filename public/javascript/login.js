//listening to the submit button from login.handlebar
//use async before the function
//use await before the promise

// Log in logic

async function loginFormHandler(event) {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
          // go back to homepage after loggin in
          // updated - go to create dashboard after logging in
        //document.location.replace('/');
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  }
  
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);


  // Sign in Logic


async function signupFormHandler(event) {
    event.preventDefault();
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && email && password) {
        const response = await fetch('/api/users', {
          method: 'post',
          body: JSON.stringify({
            username,
            email,
            password
          }),
          headers: { 'Content-Type': 'application/json' }
        });
       // console.log(response);.
           // check the response status
        if (response.ok) {
            //console.log(`this is the response ${response}`)
            
            console.log('success');
        } else {
            alert(response.statusText);
        }
      }

    // if (username && email && password) {
    //     await fetch('/api/users', {
    //       method: 'post',
    //       body: JSON.stringify({
    //         /*this is what stringify is translating the data into.
    //          {username: "esroleo", email: "esroleo@gmail.com", password: "test"}
    //         email: "esroleo@gmail.com"
    //         password: "test"
    //         username: "esroleo"
    //         */
    //         username,
    //         email,
    //         password
    //       }),
    //       headers: { 'Content-Type': 'application/json' }
    //     }).then((response) => {console.log(response)})
    //   }
  
  }

  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);