document.addEventListener("DOMContentLoaded", () => {
    const postBtn = document.getElementById("postBtn");
    const feedBox = document.getElementById("feedBox");

    async function fetchFeed() {
        try {
            let response = await fetch('http://localhost:5000/all-posts');
            let data = await response.json();
            let html = '';
            
            if (data.length === 0) {
                feedBox.innerHTML = "<p>No posts yet.</p>";
                return;
            }

            data.forEach(post => {
                html += `
                    <div class="post-card">
                        <b>@${post.authorName}</b>
                        <p>${post.postContent}</p>
                        <button class="like-btn" onclick="likePost('${post._id}')">👍 Like (${post.likes})</button>
                    </div>
                `;
            });
            feedBox.innerHTML = html;
        } catch(e) {
            feedBox.innerHTML = "<p style='color:red;'>Run server2.js on port 5000!</p>";
        }
    }

    async function publishPost() {
        let author = document.getElementById('author').value;
        let content = document.getElementById('content').value;

        if (!author || !content) {
            alert("Fill all fields first!");
            return;
        }

        await fetch('http://localhost:5000/create-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authorName: author, postContent: content })
        });

        document.getElementById('content').value = '';
        fetchFeed();
    }

    window.likePost = async function(postId) {
        await fetch(`http://localhost:5000/like-post/${postId}`, { method: 'POST' });
        fetchFeed();
    };

    postBtn.addEventListener("click", publishPost);
    fetchFeed();
});