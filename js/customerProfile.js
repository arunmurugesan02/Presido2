document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const policiesContainer = document.getElementById("policiesContainer");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:5104/api/CustomerPolicy/GetByCustomer", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.$values) {
            data.$values.forEach(policy => {
                const expiryDate = new Date(policy.expiryDate);
                const today = new Date();
                const timeDifference = expiryDate - today;
                const daysToExpiry = Math.ceil(timeDifference / (1000 * 3600 * 24));
                let status = "";
                let cardClass = "policy-card";
                let statusColor = "";

                if (daysToExpiry > 30) {
                    status = "Active";
                    statusColor = "green";
                } else if (daysToExpiry > 0 && daysToExpiry <= 30) {
                    status = "Expiring Soon";
                    statusColor = "orange";
                    cardClass += " expiring-soon";
                } else if (daysToExpiry <= 0 && Math.abs(daysToExpiry) <= 30) {
                    status = "Expired";
                    statusColor = "red";
                    cardClass += " expired";
                } else {
                    status = "Revival Available";
                    statusColor = "purple";
                    cardClass += " revival-available";
                }

                const policyCard = document.createElement("div");
                policyCard.className = cardClass;
                policyCard.innerHTML = `
                    <h3>Policy: ${policy.policyName}</h3>
                    <p>Policy ID: ${policy.policyID}</p>
                    <p>Status: <span style="color: ${statusColor}">${status}</span></p>
                    <p>Expiry Date: ${expiryDate.toLocaleDateString()}</p>
                    <button onclick="viewPolicyDetails('${policy.policyID}')">View Details</button>
                    <button onclick="raiseClaim('${policy.policyID}')">Raise Claim</button>
                    ${status === "Revival Available" ? `<button onclick="revivalPolicy('${policy.policyID}')">Revival</button>` : ''}
                    ${status === "Active" || status === "Expiring Soon" ? `<button onclick="renewPolicy('${policy.policyID}')">Renewal</button>` : ''}
                `;
                policiesContainer.appendChild(policyCard);
            });
        }
    })
    .catch(error => console.error("Error fetching customer policies:", error));
});

function viewPolicyDetails(policyID) {
    localStorage.setItem("selectedPolicyID", policyID);
    window.location.href = "../../html/Customer/CustomerPolicyDetails.html";
}

function raiseClaim(policyID) {
    localStorage.setItem("selectedPolicyID", policyID);
    window.location.href = '../../html/Customer/raise-claim.html';
}

function renewPolicy(policyID) {
    localStorage.setItem("selectedPolicyID", policyID);
    window.location.href = "../../html/Customer/policy-renewal.html";
}

function revivalPolicy(policyID) {
    localStorage.setItem("selectedPolicyID", policyID);
    window.location.href = "../../html/Customer/RevivalPolicy.html";
}
