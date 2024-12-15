// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});

async function signIn() {

    const user_dto = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
            "SignIn",
            {
                method: "POST",
                body: JSON.stringify(user_dto),
                headers: {
                    "Content-Type": "application/json"
                }
            }
    );

    if (response.ok) {
        const json = await response.json();

        if (json.success) {
            window.location = "index.html";

        } else {

            if (json.content === "Unverified") {

                window.location = "verify-account.html";

            } else {

                notifier.warning(json.content);
               

            }
        }

    } else {
        
        notifier.alert("Server Error");
    
    }
}