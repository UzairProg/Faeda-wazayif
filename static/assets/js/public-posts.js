const data = {
    currentUser: {
        image: {
            png: "./images/avatars/image-juliusomo.png",
            webp: "./images/avatars/image-juliusomo.webp",
        },
        username: "ام المستخدم",
    },
    comments: [
        {
            parent: 0,
            id: 1,
            content: "المنشور",
            createdAt: "الزمن",
            score: 12,
            user: {
                image: {
                    png: "./images/avatars/image-amyrobson.png",
                    webp: "./images/avatars/image-amyrobson.webp",
                },
                username: "اسم المستخدم",
            },
            replies: [],
        },
        {
            parent: 0,
            id: 2,
            content: "المنشور",
            createdAt: " الزمن",
            score: 5,
            user: {
                image: {
                    png: "./images/avatars/image-maxblagun.png",
                    webp: "./images/avatars/image-maxblagun.webp",
                },
                username: "اسم المستخدم ",
            },
            replies: [
                {
                    parent: 2,
                    id: 1,
                    content: "التلعيق",
                    createdAt: " الزمن",
                    score: 4,
                    replyingTo: "اسم المستخدم اللى ناشر البوست",
                    user: {
                        image: {
                            png: "./images/avatars/image-ramsesmiron.png",
                            webp: "./images/avatars/image-ramsesmiron.webp",
                        },
                        username: "  اسم المستخدم اللى رد ",
                    },
                },
                {
                    parent: 2,
                    id: 1,
                    content: "التعليق",
                    createdAt: " الزمن",
                    score: 2,
                    replyingTo: "اسم المستخدم اللى رد",
                    user: {
                        image: {
                            png: "./images/avatars/image-juliusomo.png",
                            webp: "./images/avatars/image-juliusomo.webp",
                        },
                        username: "اسم المستخدم",
                    },
                },
            ],
        },
    ],
};
function appendFrag(frag, parent) {
    var children = [].slice.call(frag.childNodes, 0);
    parent.appendChild(frag);
    //console.log(children);
    return children[1];
}

const addComment = (body, parentId, replyTo = undefined) => {
    let commentParent =
        parentId === 0
            ? data.comments
            : data.comments.filter((c) => c.id == parentId)[0].replies;
    let newComment = {
        parent: parentId,
        id:
            commentParent.length == 0
                ? 1
                : commentParent[commentParent.length - 1].id + 1,
        content: body,
        createdAt: "الاّن",
        replyingTo: replyTo,
        score: 0,
        replies: parent == 0 ? [] : undefined,
        user: data.currentUser,
    };
    commentParent.push(newComment);
    initComments();
};
const deleteComment = (commentObject) => {
    if (commentObject.parent == 0) {
        data.comments = data.comments.filter((e) => e != commentObject);
    } else {
        data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
            data.comments
                .filter((e) => e.id === commentObject.parent)[0]
                .replies.filter((e) => e != commentObject);
    }
    initComments();
};

const promptDel = (commentObject) => {
    const modalWrp = document.querySelector(".modal-wrp");
    modalWrp.classList.remove("invisible");
    modalWrp.querySelector(".yes").addEventListener("click", () => {
        deleteComment(commentObject);
        modalWrp.classList.add("invisible");
    });
    modalWrp.querySelector(".no").addEventListener("click", () => {
        modalWrp.classList.add("invisible");
    });
};

const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
    if (parent.querySelectorAll(".reply-input")) {
        parent.querySelectorAll(".reply-input").forEach((e) => {
            e.remove();
        });
    }
    const inputTemplate = document.querySelector(".reply-input-template");
    const inputNode = inputTemplate.content.cloneNode(true);
    const addedInput = appendFrag(inputNode, parent);
    addedInput.querySelector(".bu-primary").addEventListener("click", () => {
        let commentBody = addedInput.querySelector(".cmnt-input").value;
        if (commentBody.length == 0) return;
        addComment(commentBody, parentId, replyTo);
    });
};

const createCommentNode = (commentObject) => {
    const commentTemplate = document.querySelector(".comment-template");
    var commentNode = commentTemplate.content.cloneNode(true);
    commentNode.querySelector(".usr-name").textContent =
        commentObject.user.username;
    commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
    commentNode.querySelector(".score-number").textContent = commentObject.score;
    commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
    commentNode.querySelector(".c-body").textContent = commentObject.content;
    if (commentObject.replyingTo)
        commentNode.querySelector(".reply-to").textContent =
            "@" + commentObject.replyingTo;

    commentNode.querySelector(".score-plus").addEventListener("click", () => {
        commentObject.score++;
        initComments();
    });

    commentNode.querySelector(".score-minus").addEventListener("click", () => {
        commentObject.score--;
        if (commentObject.score < 0) commentObject.score = 0;
        initComments();
    });
    if (commentObject.user.username == data.currentUser.username) {
        commentNode.querySelector(".comment").classList.add("this-user");
        commentNode.querySelector(".delete").addEventListener("click", () => {
            promptDel(commentObject);
        });
        commentNode.querySelector(".edit").addEventListener("click", (e) => {
            const path = e.path[3].querySelector(".c-body");
            if (
                path.getAttribute("contenteditable") == false ||
                path.getAttribute("contenteditable") == null
            ) {
                path.setAttribute("contenteditable", true);
                path.focus()
            } else {
                path.removeAttribute("contenteditable");
            }

        });
        return commentNode;
    }
    return commentNode;
};

const appendComment = (parentNode, commentNode, parentId) => {
    const bu_reply = commentNode.querySelector(".reply");
    // parentNode.appendChild(commentNode);
    const appendedCmnt = appendFrag(commentNode, parentNode);
    const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
    bu_reply.addEventListener("click", () => {
        if (parentNode.classList.contains("replies")) {
            spawnReplyInput(parentNode, parentId, replyTo);
        } else {
            //console.log(appendedCmnt.querySelector(".replies"));
            spawnReplyInput(
                appendedCmnt.querySelector(".replies"),
                parentId,
                replyTo
            );
        }
    });
};

function initComments(
    commentList = data.comments,
    parent = document.querySelector(".comments-wrp")
) {
    parent.innerHTML = "";
    commentList.forEach((element) => {
        var parentId = element.parent == 0 ? element.id : element.parent;
        const comment_node = createCommentNode(element);
        if (element.replies && element.replies.length > 0) {
            initComments(element.replies, comment_node.querySelector(".replies"));
        }
        appendComment(parent, comment_node, parentId);
    });
}

initComments();
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = cmntInput.querySelector(".cmnt-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, 0);
    cmntInput.querySelector(".cmnt-input").value = "";
});

function show_comment() {
    var s = document.getElementById("con1");
    s.style.display = "block";
}

function hide_comment() {
    var s = document.getElementById("con1");
    s.style.display = "none";
}


function show_more() {
    var s = document.getElementById("more");
    var x = document.getElementById("few");

    s.style.display = "none";
    x.style.display = "block";
}

function show_few() {
    var s = document.getElementById("more");
    var x = document.getElementById("few");

    s.style.display = "block";
    x.style.display = "none";
}
// addComment("Hello ! It works !!",0);
function toggle_comment() {
    var s = document.getElementById("con1");
    if (s.style.display === "none" || s.style.display === "") {
        s.style.display = "block";
    } else {
        s.style.display = "none";
    }
}