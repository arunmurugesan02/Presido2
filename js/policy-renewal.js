document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const policyID = localStorage.getItem("selectedPolicyID");
    const policyDetailsContainer = document.getElementById("policyDetailsContainer");
    const renewButton = document.getElementById("renewButton");

    if (!token || !policyID) {
        window.location.href = "profile.html";
        return;
    }

    fetch(`http://localhost:5104/api/CustomerPolicy/GetByCustomer/${policyID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            const expiryDate = new Date(data.expiryDate).toLocaleDateString();
            policyDetailsContainer.innerHTML = `
                <h3>Policy: ${data.policyName}</h3>
                <p>Policy ID: ${data.policyID}</p>
                <p>Expiry Date: ${expiryDate}</p>
            `;
        }
    })
    .catch(error => console.error("Error fetching policy details:", error));

    renewButton.addEventListener("click", function () {
        fetch(`http://localhost:5104/api/Renewal/add/${policyID}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = "../../html/Customer/payment.html"; // Navigate to payment page
        })
        .catch(error => alert("Error processing renewal: " + error.message));
    });
});
