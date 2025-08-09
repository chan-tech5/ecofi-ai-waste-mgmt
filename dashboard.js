// Function to Generate Random Data for Demo
function getRandomData(max) {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * max) + 10);
}

// Waste Chart
const wasteChart = new Chart(document.getElementById("wasteChart"), {
    type: "bar",
    data: {
        labels: ["Plastic", "Paper", "E-Waste", "Glass", "Metal", "Organic"],
        datasets: [{
            label: "Waste Recycled (kg)",
            data: getRandomData(50),
            backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0", "#607D8B"]
        }]
    }
});

// Issue Reports Chart
const issueChart = new Chart(document.getElementById("issueChart"), {
    type: "doughnut",
    data: {
        labels: ["Pending", "Resolved", "Rejected"],
        datasets: [{
            label: "Issue Reports",
            data: [5, 12, 3], // Example values
            backgroundColor: ["#F44336", "#4CAF50", "#FFC107"]
        }]
    }
});