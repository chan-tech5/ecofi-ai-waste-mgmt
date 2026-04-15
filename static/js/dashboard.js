// Global Chart defaults for Dark Mode readability
Chart.defaults.color = '#cbd5e1';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// Function to Generate Random Data for Demo
function getRandomData(max) {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * max) + 10);
}

// Waste Chart
const wasteCtx = document.getElementById("wasteChart");
if (wasteCtx) {
    new Chart(wasteCtx, {
        type: "bar",
        data: {
            labels: ["Plastic", "Paper", "E-Waste", "Glass", "Metal", "Organic"],
            datasets: [{
                label: "Waste Recycled (kg)",
                data: getRandomData(50),
                backgroundColor: [
                    "#00c853", "#2196F3", "#FFC107", 
                    "#FF5722", "#9C27B0", "#00bcd4"
                ],
                borderRadius: 4
            }]
        },
        options: {
            plugins: {
                legend: { labels: { font: { family: 'Inter' } } }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Issue Reports Chart
const issueCtx = document.getElementById("issueChart");
if (issueCtx) {
    new Chart(issueCtx, {
        type: "doughnut",
        data: {
            labels: ["Pending", "Resolved", "Rejected"],
            datasets: [{
                label: "Issue Reports",
                data: [5, 12, 3], // Example values
                backgroundColor: ["#FFC107", "#00c853", "#F44336"],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { font: { family: 'Inter' } } }
            }
        }
    });
}