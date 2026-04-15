document.addEventListener("DOMContentLoaded", function () {
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const answer = this.nextElementSibling;
            const arrow = this.querySelector(".arrow");

            //  Toggle the answer display
            if (answer.style.display === "block") {
                answer.style.display = "none";
                arrow.innerHTML = "▼";
            } else {
                answer.style.display = "block";
                arrow.innerHTML = "▲";
            }
        });
    });
});
