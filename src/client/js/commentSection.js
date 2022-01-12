const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoComment = document.querySelector(".video__comment");
const deleteBtns = document.querySelectorAll(".comment__delete")
const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    const button = document.createElement("button");
    button.className = "comment__delete";
    button.dataset.id = id;
    span.innerText = `${text}`;
    button.innerText = "❌"
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(button);
    videoComments.prepend(newComment);
    button.addEventListener("click", handleDelete);
    }
    const handleDelete = async () => {
        const deleteBtn = document.querySelector(".comment__delete");
        await fetch(`/api/comment/${deleteBtn.dataset.id}/delete`,{
            method:"DELETE"
        })
        window.location.reload();
    };
const handleSumbit = async (event)=>{
event.preventDefault();
const text = textarea.value;
const videoId = videoContainer.dataset.id;
if(text===""){
    return;
}
const response = await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{
        "Content-Type": "application/json",
    },
    body:JSON.stringify({text}),
});
if(response.status === 201){
textarea.value="";
const {newCommentId} = await response.json();
addComment(text, newCommentId);
}
};


for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener('click', handleDelete);
  }

form.addEventListener("submit", handleSumbit);