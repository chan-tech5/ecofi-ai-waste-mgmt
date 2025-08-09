// Function to Simulate Forum Post
function postMessage() {
    const forumPost = document.getElementById("forumPost").value;
    const forumMessages = document.getElementById("forumMessages");

    if (forumPost.trim() === "") {
        alert("Please enter a message before posting.");
        return;
    }

    const newMessage = document.createElement("p");
    newMessage.innerText = `🗣️ ${forumPost}`;
    forumMessages.prepend(newMessage);

    // Clear input
    document.getElementById("forumPost").value = "";
}
