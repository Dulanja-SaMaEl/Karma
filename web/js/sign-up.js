// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});

async function signUp() {

    const user_dto = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
            "SignUp",
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
            window.location = "verify-account.html";

        } else {
            notifier.warning(json.content);
        }

    } else {
        notifier.alert("Server Error");
    }
}