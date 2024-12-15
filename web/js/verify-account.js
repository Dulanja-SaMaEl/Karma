// Initialize Awesome Notifications
const notifier = new AWN({
    position: "top-right" // Set position to top-right
});


async function verifyAccount() {

    const dto = {
        verification: document.getElementById("verification").value
    };

    const response = await fetch(
            "Verification",
            {
                method: "POST",
                body: JSON.stringify(dto),
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
            notifier.warning(json.content);
        }

    } else {
        notifier.alert("Server Error");
    }
}