const parsePosts = (xml) => {
    const parser = new DOMParser();
    const parsedXml = parser.parseFromString(xml.replace('<?xml version="1.0" encoding="UTF-8"?>',''), "text/xml");
    return Array.from(parsedXml.querySelectorAll('Post')).map(post => {
        const id = post.querySelector('Id').textContent;
        const authorName = post.querySelector('AuthorName').textContent;
        const authorImage = post.querySelector('ProfileImage').textContent;
        const dateTime = post.querySelector('DateTime').textContent.replace('T', ' ');
        const title = post.querySelector('PostTitle').textContent;
        const text = post.querySelector('MessageText').textContent;
        const image = (post.querySelector('MessageImage')) ? post.querySelector('MessageImage').textContent : null;
        const likesCount = post.querySelector('Likes').textContent;
        const commentsCount = post.querySelectorAll('Comment').length;
        const comments = Array.from(post.querySelectorAll('Comment')).map(comment => {
            const id = comment.querySelector('Id').textContent;
            const commentAuthorName = comment.querySelector('CommentAuthorName').textContent;
            const commentAuthorImage = comment.querySelector('CommentProfileImage').textContent;
            const commentDateTime = comment.querySelector('CommentDateTime').textContent.replace('T', ' ');
            const commentText = comment.querySelector('CommentText').textContent;
            const commentImage = (post.querySelector('CommentImage')) ? post.querySelector('CommentImage').textContent : null;
            const commentLikes = comment.querySelector('CommentLikes').textContent;
            return {
                id,
                authorName: commentAuthorName,
                authorImage: commentAuthorImage,
                dateTime: commentDateTime,
                text: commentText,
                image: commentImage,
                likes: commentLikes
            }
        });
        const snippet = text.length > 100 ? text.substring(0, 100) + '...' : text;
        return {
            id,
            authorName,
            authorImage,
            text,
            dateTime,
            title,
            snippet,
            image,
            likesCount,
            commentsCount,
            comments
        }
    });
}

const getPostsData = async (limit= 10, offset = 0, other = 0) => {
    const fileToFetch = other ? '/xml/posts2.xml' : '/xml/posts1.xml';
     const response = await fetch(fileToFetch, 
        {
            method: 'GET',
            query : {
                limit,
                offset
            }
        }
    );
    const postsXml = await response.text();
    const posts = parsePosts(postsXml);
    const postsContainer = document.getElementById('homepage');
    posts.forEach(post => {
        // container
        const postElement = document.createElement('div');
        postElement.dataset.postid = post.id;
        postElement.classList.add('post');
        const postLink = document.createElement('a');
        postLink.classList.add('post__link');
        postLink.id = `post__link`;
        postLink.dataset.postid = post.id;
        // header
        const postHeader = document.createElement('div');
        postHeader.classList.add('post__header');
        const authorImage = document.createElement('img');
        authorImage.src = post.authorImage;
        authorImage.classList.add('post__profile-image');
        const authorName = document.createElement('span');
        authorName.classList.add('post__author');
        authorName.textContent = post.authorName;
        const postDateTime = document.createElement('div');
        postDateTime.classList.add('post__datetime');
        const date = new Date(post.dateTime);
        postDateTime.textContent = `Pubblicato il ${date.toLocaleString()}`;
        postHeader.appendChild(authorImage);
        postHeader.appendChild(authorName);
        postHeader.appendChild(postDateTime);

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
    const btn = `<button class="btn" id="load_more" style="width: 100%;">Carica altri post</button>`;
    postsContainer.innerHTML += btn;
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
    postOnModal(id);
    loadComments(id);
    setTimeout(function(){
        document.querySelector('.comments').scrollIntoView({behavior:"smooth"});
    }, 500); 
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
    loadComments(postId);
}

const loadComments = async (postId) => {
    document.querySelector('#comments_show_btn').style.display = 'none';
    const response = await fetch(`/xml/${postId}.xml`);
    const postXML = await response.text();
    const post = parsePosts(postXML)[0];
    const commentsContainer = document.getElementById('comments_list');
    comments = post.comments;
    comments.forEach(comment => {
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
        const commentDateTime = document.createElement('div');
        commentDateTime.classList.add('comment__datetime');
        const date = new Date(comment.dateTime);
        commentDateTime.textContent = `Pubblicato il ${date.toLocaleString()}`;

        commentHeader.appendChild(commentAuthorImage);
        commentHeader.appendChild(commentAuthorName);
        commentHeader.appendChild(commentDateTime);

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
}

const postOnModal = async (postId) => {
    //Caricamento post nella modale
    const response = await fetch(`/xml/${postId}.xml`);
    const postXML = await response.text();
    const post = parsePosts(postXML)[0];

    document.getElementById('modal').style.display = 'block'
    document.getElementById('modal-overlay').style.display = 'block'

    const postContainer = document.getElementById('postFull');
    postContainer.dataset.postid = postId;
    // header
    const headerElement = document.createElement('div');
    headerElement.classList.add('post__header');
    const authorImage = document.createElement('img');
    authorImage.src = post.authorImage;
    authorImage.classList.add('post__profile-image');
    const authorName = document.createElement('span');
    authorName.classList.add('post__author');
    authorName.textContent = post.authorName;
    const postDateTime = document.createElement('div');
    postDateTime.classList.add('post__datetime');
    const date = new Date(post.dateTime);
    postDateTime.textContent = `Pubblicato il ${date.toLocaleString()}`;
    headerElement.appendChild(authorImage);
    headerElement.appendChild(authorName);
    headerElement.appendChild(postDateTime)

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
    contentElement.textContent = post.text;

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

    footerElement.appendChild(likeElement);

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

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'post__link') {
            const postId = event.target.dataset.postid;
            postOnModal(postId);
        }
    });

    //A modale aperta, innesca i listener
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'comments_show_btn') {
            loadComments(postPage.dataset.postid);
        }

        if (event.target && event.target.id == 'comment_submit') {
            const comment = document.querySelector(`#comment_input`).value;
            const commentFile = document.querySelector(`#comment_image`).files[0];
            postComment(postPage.dataset.postid, comment, commentFile);
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'modal-overlay') {
            //Chiusura modale
            document.getElementById('modal').style.display = 'none'
            document.getElementById('modal-overlay').style.display = 'none'
            document.getElementById('postFull').replaceChildren()
            document.querySelector('#comments_show_btn').removeAttribute('style');
            document.querySelector('#comments_list').replaceChildren();
        }
    });    

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'load_more') {
            document.querySelector('#load_more').remove();
            getPostsData(10, 1, 1);
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

       

        if (event.target && event.target.id == 'post') {
            post();
        }
    });
    
    document.getElementById('search').addEventListener('input', async function(event) {
       search(event.target.value);
    });

});