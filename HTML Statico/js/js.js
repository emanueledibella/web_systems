const getPostsData = async () => {
    //  const postsJson = await fetch('/posts/', 
    //     {
    //         method: 'GET',
    //         query : {
    //             limit: 10,
    //             offset: 0
    //         }
    //     }
    //  );
    // const posts = await postsJson.json();
    const posts = [
        {
            id: 1,
            authorImage: "https://randomuser.me/api/portraits",
            authorName: "John Doe",
            image: "https://picsum.photos/200/300",
            snippet: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.",
            likesCount: 10,
            commentsCount: 5
        },
        {
            id: 2,
            authorImage: "https://randomuser.me/api/portraits",
            authorName: "Mary Jane",
            image: "https://picsum.photos/200/300",
            snippet: "sic semper tyrannis et tu brute Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.",
            likesCount: 30,
            commentsCount: 25
        },
        {
            id: 3,
            authorImage: "https://randomuser.me/api/portraits",
            authorName: "A random person",
            snippet: "Apelle nemo altero nam nec purus nec nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            likesCount: 30,
            commentsCount: 25
        },
    ];
    const postsContainer = document.getElementById('homepage');
    posts.forEach(post => {
        // container
        const postElement = document.createElement('div');
        postElement.dataset.postid = post.id;
        postElement.classList.add('post');
        const postLink = document.createElement('a');
        postLink.href = `/post/${post.id}`;
        postLink.classList.add('post__link');
        // header
        const postHeader = document.createElement('div');
        postHeader.classList.add('post__header');
        const authorImage = document.createElement('img');
        authorImage.src = post.authorImage;
        authorImage.classList.add('post__profile-image');
        const authorName = document.createElement('span');
        authorName.classList.add('post__author');
        authorName.textContent = post.authorName;
        postHeader.appendChild(authorImage);
        postHeader.appendChild(authorName);

        // body
        const postBody = document.createElement('div');
        postBody.classList.add('post__body');
        const postTitle = document.createElement('h2');
        postTitle.classList.add('post__title');
        postTitle.textContent = post.title;
        let postImage;
        if (post.image) {
            postImage = document.createElement('img');
            postImage.src = post.image;
            postImage.classList.add('post__image');
        }
        const postSnippet = document.createElement('p');
        postSnippet.classList.add('post__snippet');
        postSnippet.textContent = post.snippet;
        postBody.appendChild(postTitle);
        if (post.image) {
            postBody.appendChild(postImage);
        }
        postBody.appendChild(postSnippet);
        
        // footer
        const postFooter = document.createElement('div');
        postFooter.classList.add('post__footer');
        //      footer like
        const postLike = document.createElement('div');
        postLike.classList.add('post__button', 'post__button--like', 'clearfix');
        postLike.dataset.postid = post.id;
        postLike.id = 'post_like';
        const postLikeIcon = document.createElement('i');
        postLikeIcon.classList.add('fa-regular', 'fa-thumbs-up');
        const postLikeCount = document.createElement('span');
        postLikeCount.classList.add('post__likes');
        postLikeCount.textContent = post.likesCount;
        postLike.appendChild(postLikeIcon);
        postLike.appendChild(postLikeCount);
        //      footer comment
        const postComment = document.createElement('div');
        postComment.classList.add('post__button', 'post__button--comment', 'clearfix');
        postComment.dataset.postid = post.id;
        postComment.id = 'post_comment';
        const postCommentIcon = document.createElement('i');
        postCommentIcon.classList.add('fa-regular', 'fa-comment');
        const postCommentCount = document.createElement('span');
        postCommentCount.classList.add('post__comments');
        postCommentCount.textContent = post.commentsCount;
        postComment.appendChild(postCommentIcon);
        postComment.appendChild(postCommentCount);

        postFooter.appendChild(postLike);
        postFooter.appendChild(postComment);

        postLink.appendChild(postHeader);
        postLink.appendChild(postBody);

        postElement.appendChild(postLink);
        postElement.appendChild(postFooter);              
        
        postsContainer.appendChild(postElement);
    });
}

const insertLike = async (e) => {
    const postId = e.target.dataset.postid;

    const result = await fetch(`post/like/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await result.json(); //returns likesCount

    if (!data.error) {
        const postLikeCount = document.querySelector(`#post__${postId} .post__likes`);
        postLikeCount.textContent = data.likesCount;
    }
}

const goToComment = (id) => {
    window.location.href = `/post/${id}#comment_input`;
}


const search = async (q) => {
    if (q.length >= 3) {
        // const response = await fetch(`/search?q=${encodeURIComponent(q)}`);
        // const results = await response.json();

        const results = [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit amet, consectetur...'
            },
            {
                id: 2,
                title: 'sic semper tyrannis et tu brute Lorem...'
            },
            {
                id: 3,
                title: 'Apelle nemo altero nam nec purus nec...'
            }
        ]

        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
        // Handle the search results here
        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.classList.add('search-results');
        document.getElementById('search').parentNode.appendChild(searchResultsContainer);

        searchResultsContainer.innerHTML = ''; // Clear previous results
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            
            const resultLink = document.createElement('a');
            resultLink.href = `/post/${result.id}`;
            resultLink.textContent = result.title;
            
            resultItem.appendChild(resultLink);
            searchResultsContainer.appendChild(resultItem);
        });
    }
}

const postComment = async (postId, comment, commentFile) => {
    // const formData = new FormData();
    // formData.append('comment', comment);
    // if (commentFile) {
    //     formData.append('commentFile', commentFile);
    // }

    // const response = await fetch(`/post/comment/${postId}`, {
    //     method: 'POST',
    //     body: formData
    // });

    // const data = await response.json();
    // if (data.success) {
    //     console.log('Comment submitted successfully');
    // } else {
    //     console.error('Error submitting comment:', data.error);
    // }

    reloadComments(postId);
}

const reloadComments = async (postId) => {
    document.querySelector('#comments_list').innerHTML = '';
    loadComment(postId);
}

const loadComment = async (postId) => {
    // const response = await fetch(`/post/comment/${postId}`);
    // const data = await response.json();
    const data = [
        {
            authorImage: "https://randomuser.me/api/portraits/men/1.jpg",
            authorName: "John Doe",
            image: "https://picsum.photos/100/100",
            text: "This is a comment from John Doe."
        },
        {
            authorImage: "https://randomuser.me/api/portraits/women/2.jpg",
            authorName: "Jane Smith",
            image: "https://picsum.photos/100/100",
            text: "This is a comment from Jane Smith."
        },
        {
            authorImage: "https://randomuser.me/api/portraits/men/3.jpg",
            authorName: "Mike Johnson",
            image: "https://picsum.photos/100/100",
            text: "This is a comment from Mike Johnson."
        }
    ]
    if (!data.error) {
        const commentsContainer = document.getElementById('comments_list');
        data.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            // Header
            const commentHeader = document.createElement('div');
            commentHeader.classList.add('comment__header');
            const commentAuthorImage = document.createElement('img');
            commentAuthorImage.src = comment.authorImage;
            commentAuthorImage.classList.add('comment__profile-image');
            const commentAuthorName = document.createElement('span');
            commentAuthorName.classList.add('comment__author');
            commentAuthorName.textContent = comment.authorName;

            commentHeader.appendChild(commentAuthorImage);
            commentHeader.appendChild(commentAuthorName);

            // Body
            const commentBody = document.createElement('div');
            commentBody.classList.add('comment__body');
            let commentImage;
            if (comment.image) {
                commentImage = document.createElement('img');
                commentImage.src = comment.image;
                commentImage.classList.add('comment__image');
            }

            const commentText = document.createElement('p');
            commentText.classList.add('comment__text');
            commentText.textContent = comment.text;

            if (comment.image) {
                commentBody.appendChild(commentImage);
            }
            commentBody.appendChild(commentText);

            commentElement.appendChild(commentHeader);
            commentElement.appendChild(commentBody);

            commentsContainer.appendChild(commentElement);
        });

    } else {
        console.error('Error loading comments:', data.error);
    }
}

const loadPost = async (postId) => {
    // const response = await fetch(`/post/${postId}`);
    // const post = await response.json();

    const post = {
        id: 1,
        authorImage: "https://randomuser.me/api/portraits/men/1.jpg",
        authorName: "John Doe",
        image: "https://picsum.photos/200/300",
        title: "First Post",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.",
        likesCount: 10,
        commentsCount: 5
    };
    
    
    const postContainer = document.getElementById('postFull');
    // header
    const headerElement = document.createElement('div');
    headerElement.classList.add('post__header');
    const authorImage = document.createElement('img');
    authorImage.src = post.authorImage;
    authorImage.classList.add('post__profile-image');
    const authorName = document.createElement('span');
    authorName.classList.add('post__author');
    authorName.textContent = post.authorName;
    
    headerElement.appendChild(authorImage);
    headerElement.appendChild(authorName);

    // body
    const bodyElement = document.createElement('div');
    bodyElement.classList.add('post__body');
    const titleElement = document.createElement('h2');
    titleElement.classList.add('post__title');
    titleElement.textContent = post.title;
    let imageElement;
    if (post.image) {
        imageElement = document.createElement('img');
        imageElement.src = post.image;
        imageElement.classList.add('post__image');
    }
    const contentElement = document.createElement('p');
    contentElement.classList.add('post__content');
    contentElement.textContent = post.content;

    bodyElement.appendChild(titleElement);
    if (post.image) {
        bodyElement.appendChild(imageElement);
    }
    bodyElement.appendChild(contentElement);

    // footer
    const footerElement = document.createElement('div');
    footerElement.classList.add('post__footer');

    // like
    const likeElement = document.createElement('div');
    likeElement.classList.add('post__button', 'post__button--like', 'clearfix');
    likeElement.dataset.postid = post.id;
    likeElement.id = 'post_like';
    const likeIcon = document.createElement('i');
    likeIcon.classList.add('fa-regular', 'fa-thumbs-up');
    const likeCount = document.createElement('span');
    likeCount.classList.add('post__likes');
    likeCount.textContent = post.likesCount;
    
    likeElement.appendChild(likeIcon);
    likeElement.appendChild(likeCount);

    // comment
    const commentElement = document.createElement('div');
    commentElement.classList.add('post__button', 'post__button--comment', 'clearfix');
    commentElement.dataset.postid = post.id;
    commentElement.id = 'post_comment';
    const commentIcon = document.createElement('i');
    commentIcon.classList.add('fa-regular', 'fa-comment');
    const commentCount = document.createElement('span');
    commentCount.classList.add('post__comments');
    commentCount.textContent = post.commentsCount;

    commentElement.appendChild(commentIcon);
    commentElement.appendChild(commentCount);

    footerElement.appendChild(likeElement);
    footerElement.appendChild(commentElement);

    postContainer.appendChild(headerElement);
    postContainer.appendChild(bodyElement);
    postContainer.appendChild(footerElement);
}

const post = async () => {
    const title = document.querySelector('#post_title').value;
    const content = document.querySelector('#post_text').value;
    const image = document.querySelector('#post_image').files[0];

    if (!title || !content) {
        alert('Compila almeno il titolo e il contenuto del post');
        return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    const response = await fetch('/post', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    
    window.location.href = `/post/${data.id}`;
}


// MAIN ON LOAD
document.addEventListener('DOMContentLoaded', function() {
    const homepage = document.getElementById('homepage');
    const postPage = document.getElementById('postFull');

    if (homepage) {
        getPostsData();
    }

    if (postPage) {
        loadPost(postPage.dataset.postid);
    }

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'comments_show_btn') {
            document.querySelector('#comments_show_btn').remove();
            loadComment(postPage.dataset.postid);
        }
    });


    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'post_like') {
            insertLike(event);
        }
    });
    
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'post_comment') {
            const postId = event.target.dataset.postid;
            goToComment(postId);
        }

        if (event.target && event.target.id == 'comment_submit') {
            const comment = document.querySelector(`#comment_input`).value;
            const commentFile = document.querySelector(`#comment_image`).files[0];
            postComment(event.target.dataset.postid, comment, commentFile);
        }

        if (event.target && event.target.id == 'post') {
            post();
        }
    });
    
    document.getElementById('search').addEventListener('input', async function(event) {
       search(event.target.value);
    });

});