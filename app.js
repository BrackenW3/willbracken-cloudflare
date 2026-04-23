// --- 1. CONFIGURATION ---
const msalConfig = {
    auth: {
        clientId: "b07e9b3b-01b2-4fcf-b643-586ccea97bbc", // From Azure App Overview
        authority: "https://login.microsoftonline.com/99150341-b2dc-4715-bab9-3b1cd11b5411",
        redirectUri: "https://auth.willbracken.com", // Updated for production on Cloudflare
    },
    cache: {
        cacheLocation: "sessionStorage", // Stores tokens securely in the browser session
        storeAuthStateInCookie: false,
    }
};

// Initialize the MSAL application object
const myMSALObj = new msal.PublicClientApplication(msalConfig);

// The permissions we want to ask the user for
const loginRequest = {
    scopes: ["User.Read"]
};

// --- 2. DOM ELEMENTS ---
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const profileArea = document.getElementById("profileArea");
const userNameSpan = document.getElementById("userName");
const userEmailSpan = document.getElementById("userEmail");
const callGraphButton = document.getElementById("callGraphButton");
const graphResponsePre = document.getElementById("graphResponse");

// --- 3. AUTHENTICATION LOGIC ---

// Check if user is already logged in on page load
myMSALObj.handleRedirectPromise().then((response) => {
    if (response) {
        updateUI(response.account);
    } else {
        const currentAccounts = myMSALObj.getAllAccounts();
        if (currentAccounts.length > 0) {
            updateUI(currentAccounts[0]);
        }
    }
}).catch(console.error);

loginButton.addEventListener("click", () => {
    // You can also use loginRedirect() if you prefer not to use popups
    myMSALObj.loginPopup(loginRequest)
        .then((response) => {
            console.log("Login successful!");
            updateUI(response.account);
        })
        .catch((error) => {
            console.error("Login failed:", error);
        });
});

logoutButton.addEventListener("click", () => {
    const account = myMSALObj.getAllAccounts()[0];
    myMSALObj.logoutPopup({ account: account });
});

function updateUI(account) {
    if (account) {
        loginButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");
        profileArea.classList.remove("hidden");

        userNameSpan.textContent = account.name;
        userEmailSpan.textContent = account.username;
    }
}

// --- 4. CALLING MICROSOFT GRAPH ---

callGraphButton.addEventListener("click", () => {
    const account = myMSALObj.getAllAccounts()[0];

    // 1. Silently get a token for the Graph API
    myMSALObj.acquireTokenSilent({
        scopes: ["User.Read"],
        account: account
    }).then((tokenResponse) => {

        // 2. Use the token to fetch data from Microsoft Graph
        fetch("https://graph.microsoft.com/v1.0/me", {
            headers: {
                "Authorization": `Bearer ${tokenResponse.accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Display the JSON response on the screen
            graphResponsePre.textContent = JSON.stringify(data, null, 4);
        })
        .catch(console.error);

    }).catch((error) => {
        // If silent token acquisition fails (e.g., expired session), force the user to interact
        console.warn("Silent token acquisition failed. Acquiring token interactively.");
        myMSALObj.acquireTokenPopup(loginRequest).then(console.log).catch(console.error);
    });
});
