

document.addEventListener("DOMContentLoaded", function () {
    const paymentForm = document.getElementById("paymentForm");
    const message = document.getElementById("message");

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const amount = document.getElementById("amount").value;

        
        setTimeout(() => {
            message.classList.remove("hidden");
            setTimeout(() => {
                message.classList.add("hidden");
            }, 3000);
        }, 1000);
    });
});
