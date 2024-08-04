document.addEventListener('DOMContentLoaded', async () => {
    const policyDetailsContainer = document.getElementById('policy-details');
    const policyId = localStorage.getItem('policyId');
    const token = localStorage.getItem('token');

    if (!token || !policyId) {
        alert('Unable to find the requested policy. Please try again.');
        window.location.href = '../../html/Customer/policy.html';
        return;
    }

    try {
        // Fetch policy details
        const response = await fetch(`http://localhost:5104/api/InsurancePolicy/Get/${policyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch policy details.');
        }

        const policy = await response.json();

        // Render policy details
        policyDetailsContainer.innerHTML = `
            <h2>${policy.policyName}</h2>
            <p>Policy Number: ${policy.policyNumber}</p>
            <p>Type: ${policy.policyType}</p>
            <p>Coverage Amount: ${policy.coverageAmount}</p>
            <p>Premium Amount: ${policy.premiumAmount}</p>
            <p>Renewal Amount: ${policy.renewalAmount}</p>
            <p>Start Date: ${new Date(policy.startDate).toLocaleDateString()}</p>
            <p>End Date: ${new Date(policy.endDate).toLocaleDateString()}</p>
            <p>Description: ${policy.description || 'No description available.'}</p>
        `;

        // Handle Apply button click
        document.getElementById('apply-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to apply for this policy?')) {
                applyForPolicy(policy.policyID);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching policy details. Please try again later.');
    }
});

// Function to apply for a policy
async function applyForPolicy(policyID) {
    const token = localStorage.getItem('token');
    const applyPolicyUrl = 'http://localhost:5104/api/CustomerPolicy/ApplyPolicy';
    const requestBody = {
        policyID: policyID,
        status: 'Active'
    };

    try {
        const response = await fetch(applyPolicyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        if (response.ok) {
            alert('Policy applied successfully.');
        } else {
            alert(`Failed to apply for policy: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while applying for the policy. Please try again later.');
    }
}
