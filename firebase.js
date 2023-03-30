// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js"
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider,
    FacebookAuthProvider, fetchSignInMethodsForEmail  } 
    from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const $ = document.querySelector.bind(document)

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCz8FRVLn3LI78urunbQp4qgwovltI1K0",
    authDomain: "ggloginauth.firebaseapp.com",
    databaseURL: "https://ggloginauth-default-rtdb.firebaseio.com",
    projectId: "ggloginauth",
    storageBucket: "ggloginauth.appspot.com",
    messagingSenderId: "110153990924",
    appId: "1:110153990924:web:e58eb2a89e649ecc8dff29"
};

//todo Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth()
const provider = new GoogleAuthProvider();
const providerFB = new FacebookAuthProvider();


//todo Buttons -------------------------------------------------------
let signInBtn = $(".btn--signIn")
let signUpBtn = $(".btn--signUp")
let signOutBtn = $(".btn--logOut")
let navBtnRes = $(".button--register")
let navBtnLog = $(".button--login")
let navLoginEd = $(".nav-list__item--user")
let googleBtn = $(".gg-connection")


//todo Functions -------------------------------------------------------
let switchingState = (f, s) => {
    navBtnRes.style.display = `${f}`
    navBtnLog.style.display = `${f}`
    navLoginEd.style.display = `${s}`
}
let closeModal = () => {
    removeClass(modalInner, "modal-inner--active")
    removeClass(modal, "visible--active")
}
const signUpEmail = () => {
    const email = $("#email").value
    const password = $("#password").value
    const retypePassword = $("#retype-pw").value
    const username = $("#username").value

    if(password === retypePassword) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Đăng ký tài khoản thành công")
                set(ref(database, 'user/' + user.uid), {
                    email: email,
                    username: username
                })
                modalFormActive(formLog, formReg)
            
                signOut(auth)
                    .then(() => {})
                    .catch((error) => {
                        console.log(error)
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
    } else {
        alert("Mật khẩu chưa trùng khớp")
    }
}
const signInEmail = () => {
    const email = $("#email-login").value
    const password = $("#password-login").value
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.location.reload();
            const user = userCredential.user;

            closeModal()

            const dt = new Date()
            update(ref(database, 'user/' + user.uid), {
                last_login: dt
            })
        })
        .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        });
}

//todo Sign Up ---------------------------------------------------
signUpBtn.addEventListener("click", function() {
    signUpEmail()
})
formReg.onkeypress = e => {
    if(e.charCode === 13) {
        signUpEmail()
    }
}

//todo Sign In ---------------------------------------------------
signInBtn.addEventListener("click", function() {
    signInEmail()
})
formLog.onkeypress = e => {
    if(e.charCode === 13) {
        signInEmail()
    }
}

//todo Sign Out ---------------------------------------------------
navLoginEd.onclick = e => {
    if(e.target.innerText === "Đăng xuất") {
        signOut(auth)
            .then(() => {
                window.location.reload();
            }).catch((error) => {
                console.log(error)
            });
    }
}

//todo Sign in with Google/Facebook account ------------------------------------
modal.addEventListener("click", function(e) {
    if(e.target.matches(".gg-connection")) {
        signInWithPopup(auth, provider)
            .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                set(ref(database, "user/" + user.uid), {
                    email: user.email,
                })
                closeModal()
                console.log("Sign In With Google Success")
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                console.log(email, errorMessage)
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }
    if(e.target.matches(".fb-connection")) {
        signInWithPopup(auth, providerFB)
            .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            closeModal()
         
            set(ref(database, "user/" + user.uid), {
                user: user
            })

            // IdP data available using getAdditionalUserInfo(result)
            console.log("Login with FB success", user)
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                if(errorMessage === "Firebase: Error (auth/account-exists-with-different-credential).") {
                    alert("You've already used this email. Sign in with Google to continue")
                }
                console.log(errorMessage)
                closeModal()
            });
    }
})


//todo Control State ---------------------------------------------------
onAuthStateChanged(auth, (user) => {
    if(user) {
        switchingState("none", "flex")
        let name = user.email
        let nameSliced = name.slice(0, name.indexOf("@"))
        let displayName = user.displayName ? user.displayName : nameSliced 
        navLoginEd.innerHTML += `
            <div class="user-avatar">
                <img src="assets/img/siuuuu.jpg" alt="User avatar">
            </div>
            ${displayName}
        `
        console.log("Logged in", user.email)
    } else {
        switchingState("flex", "none")
        console.log("Logged out")
    }
});
 