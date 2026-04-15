function classifyWaste() {
    const fileInput = document.getElementById("imageUpload") || document.getElementById("wasteImage");
    const resultText = document.getElementById("classificationResult");
    const insightsPanel = document.getElementById("insightsPanel");
    const categoryBadge = document.getElementById("categoryBadge");
    const instructions = document.getElementById("handlingInstructions");

    if (!fileInput || fileInput.files.length === 0) {
        alert("Please select an image!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // Reset UI
    resultText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    resultText.style.color = "#cbd5e1";
    insightsPanel.style.display = "none";

    fetch("/classify", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultText.innerText = "Error: " + data.error;
            resultText.style.color = "#F44336";
        } else {
            const category = data.category;
            resultText.innerHTML = `Classification: <span style="color: #00c853;">${category}</span>`;
            
            // Show Insights
            showInsights(category);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        resultText.innerText = "Error in classification. Please try again.";
        resultText.style.color = "#F44336";
    });
}

function showInsights(category) {
    const insightsPanel = document.getElementById("insightsPanel");
    const categoryBadge = document.getElementById("categoryBadge");
    const instructions = document.getElementById("handlingInstructions");

    const insightData = {
        "Biodegradable": {
            badgeClass: "badge-organic",
            icon: "fas fa-leaf",
            text: "Wet Waste: Perfect for composting! These items will decompose naturally. Place in your green bin to reduce landfill methane emissions."
        },
        "Plastic": {
            badgeClass: "badge-recyclable",
            icon: "fas fa-bottle-water",
            text: "Recyclable: Clean and dry plastic items can be sold on the EcoFi Marketplace. Proper cleaning prevents contamination."
        },
        "Paper": {
            badgeClass: "badge-recyclable",
            icon: "fas fa-file-alt",
            text: "Recyclable: Flatten cardboard and bundle newspapers. Avoid recycling oil-stained paper (like pizza boxes)."
        },
        "Metal_Glass": {
            badgeClass: "badge-recyclable",
            icon: "fas fa-glass-martini-alt",
            text: "Recyclable: Aluminum cans and glass jars have high resale value. Rinse well before disposal."
        },
        "E-Waste": {
            badgeClass: "badge-recyclable",
            icon: "fas fa-plug",
            text: "High Value: Contains precious metals! Sell this on our marketplace or find a certified e-waste recycler."
        },
        "Construction_Debris": {
            badgeClass: "badge-pending",
            icon: "fas fa-hammer",
            text: "B2B Logistics: Concrete, bricks, and wood. Use the Business Dashboard to request a heavy-duty pickup vehicle."
        },
        "Bio_Medical": {
            badgeClass: "badge-hazardous",
            icon: "fas fa-biohazard",
            text: "HIGH RISK / BIOHAZARD: Securely wrap and mark as medical waste. Contact a certified bio-medical handler immediately."
        },
        "Hazardous": {
            badgeClass: "badge-hazardous",
            icon: "fas fa-radiation",
            text: "Toxic Waste: Batteries, chemicals, or paint. Do not throw in regular bins. Use specialized hazardous drop-off points."
        },
        "Residual": {
            badgeClass: "badge-pending",
            icon: "fas fa-trash",
            text: "Non-Recyclable: This waste is for landfill disposal. Minimize use of such items in the future to reduce your footprint."
        }
    };

    const info = insightData[category] || insightData["Recyclable"];
    
    categoryBadge.className = "insight-badge " + info.badgeClass;
    categoryBadge.innerHTML = `<i class="${info.icon}"></i> ${category}`;
    instructions.innerText = info.text;
    
    insightsPanel.style.display = "block";
}

// Select element
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.taskbar');
const navLinks = document.querySelectorAll('.taskbar a');

// Toggle menu on button click
if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}
// Image Preview logic
const imageUpload = document.getElementById('imageUpload');
if (imageUpload) {
    imageUpload.addEventListener('change', function() {
        const previewContainer = document.getElementById('imagePreview');
        const previewImg = previewContainer.querySelector('img');
        
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewContainer.style.display = "block";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

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
