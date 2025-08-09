function classifyWaste() {
    const fileInput = document.getElementById("wasteImage");
    const resultText = document.getElementById("classificationResult");

    if (fileInput.files.length === 0) {
        alert("Please select an image!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("https://your-deployed-ai-api.com/classify", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultText.innerText = `Waste Classification: ${data.category}`;
    })
    .catch(error => {
        resultText.innerText = "Error in classification. Please try again.";
    });
}

// Select element
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.taskbar');
const navLinks = document.querySelectorAll('.taskbar a');

// Toggle menu on button click
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close menu when a link is clicked (on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// Close menu when clicking outside of it
document.addEventListener('click', (event) => {
    if (!menuToggle.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
    }
});
