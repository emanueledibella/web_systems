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

const getPostsData = async (limit = 10, offset = 0, other = 0, homepage = 1) => {
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
    const postsContainer = homepage ? $('#homepage') : $('#profile');
    
    posts.forEach(post => {
        const postElement = $('<div>').addClass('post').attr('data-postid', post.id);
        const postLink = $('<a>').addClass('post__link').attr('data-postid', post.id);

        // Header
        const postHeader = $('<div>').addClass('post__header')
            .append($('<img>').attr('src', post.authorImage ? post.authorImage : './img/user.png').addClass('post__profile-image'))
            .append($('<span>').addClass('post__author').text(post.authorName))
            .append($('<div>').addClass('post__datetime').text(`Pubblicato il ${new Date(post.dateTime).toLocaleString()}`));

        // Body
        const postBody = $('<div>').addClass('post__body')
            .append($('<h2>').addClass('post__title').text(post.title));
        if (post.image) {
            postBody.append($('<img>').attr('src', post.image).addClass('post__image'));
        }
        postBody.append($('<p>').addClass('post__snippet').text(post.snippet));

        // Footer
        const postFooter = $('<div>').addClass('post__footer')
            //Like
            .append($('<div>').addClass('post__button post__button--like clearfix post_like').attr('data-postid', post.id)
            .append($('<i>').addClass('fa-regular fa-thumbs-up'))
            .append($('<span>').addClass('post__likes').text(post.likesCount)))
            // Comments
            .append($('<div>').addClass('post__button post__button--comment clearfix post_comment').attr('data-postid', post.id)
            .append($('<i>').addClass('fa-regular fa-comment'))
            .append($('<span>').addClass('post__comments').text(post.commentsCount)));
        
        postLink.append(postHeader, postBody);
        postElement.append(postLink, postFooter);
        
        postsContainer.append(postElement);
    });

    const btn = `<button class="btn" id="load_more" style="width: 100%;">Carica altri post</button>`;
    postsContainer.append(btn);
};


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
    showModal(id);
    loadComments(id);
    setTimeout(function(){
        document.querySelector('.comments').scrollIntoView({behavior:"smooth"});
    }, 500); 
}

const search = async (q) => {
    if (q.length >= 3) {
        // const response = await fetch(/search?q=${encodeURIComponent(q)});
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
            resultItem.dataset.postid = result.id;
            
            const resultLink = document.createElement('a');
            resultLink.classList.add('search-result-link');
            resultLink.textContent = result.title;
            
            resultItem.appendChild(resultLink);
            searchResultsContainer.appendChild(resultItem);
        });

        $('.search-result-item').on('click', function(event){
            let postId = $(this).data('postid');
            showModal(postId);
            $('.search-results').remove();
            $('#search').val('');
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
    $('#comments_list').empty();
    loadComments(postId);
}

const loadComments = async (postId) => {
    $('#comments_show_btn').hide();
    const response = await fetch(`/xml/${postId}.xml`);
    const postXML = await response.text();
    const comments = parsePosts(postXML)[0].comments;
    const commentsContainer = $('#comments_list');

    comments.forEach(comment => {
        const commentElement = $('<div>').addClass('comment');

        // Header
        const commentHeader = $('<div>').addClass('comment__header')
            .append($('<img>').attr('src', comment.authorImage).addClass('comment__profile-image'))
            .append($('<span>').addClass('comment__author').text(comment.authorName))
            .append($('<div>').addClass('comment__datetime').text(`Pubblicato il ${new Date(comment.dateTime).toLocaleString()}`));

        // Body
        const commentBody = $('<div>').addClass('comment__body');
        if (comment.image) {
            commentBody.append($('<img>').attr('src', comment.image).addClass('comment__image'));
        }
        commentBody.append($('<p>').addClass('comment__text').text(comment.text));

        // Footer
        const footerElement = $('<div>').addClass('comment__footer');
        const likeElement = $('<div>').addClass('comment__button comment__button--like clearfix comment_like')
            .attr('data-commentid', comment.id)
            .append($('<i>').addClass('fa-regular fa-thumbs-up'))
            .append($('<span>').addClass('post__likes').text(comment.likes));

        footerElement.append(likeElement);
        commentElement.append(commentHeader, commentBody, footerElement);
        commentsContainer.append(commentElement);
    });
};

const showModal = async (postId) => {
    const response = await fetch(`/xml/${postId}.xml`);
    const postXML = await response.text();
    const post = parsePosts(postXML)[0];

    const postContainer = $('#postFull').attr('data-postid', postId);//.empty();

    // Header
    const headerElement = $('<div>').addClass('post__header')
        .append($('<img>').attr('src', post.authorImage ? post.authorImage : './img/user.png').addClass('post__profile-image'))
        .append($('<span>').addClass('post__author').text(post.authorName))
        .append($('<div>').addClass('post__datetime').text(`Pubblicato il ${new Date(post.dateTime).toLocaleString()}`));

    // Body
    const bodyElement = $('<div>').addClass('post__body')
        .append($('<h2>').addClass('post__title').text(post.title));
    if (post.image) {
        bodyElement.append($('<img>').attr('src', post.image).addClass('post__image'));
    }
    bodyElement.append($('<p>').addClass('post__content').text(post.text));

    // Footer
    const footerElement = $('<div>').addClass('post__footer');
    const likeElement = $('<div>').addClass('post__button post__button--like clearfix post_like')
        .attr('data-postid', post.id)
        .append($('<i>').addClass('fa-regular fa-thumbs-up'))
        .append($('<span>').addClass('post__likes').text(post.likesCount));

    footerElement.append(likeElement);

    postContainer.append(headerElement, bodyElement, footerElement);

    $('#modal').addClass('open');
    $('#modal-overlay').show();
};

const post = async () => {
    const title = $('#post_title').val();
    const content = $('#post_text').val();
    const image = $('#post_image').files[0];

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
$(document).ready(function() {
    const homepage = $('#homepage');
    const profilePage = $('#profile');

    if (homepage) {
        getPostsData();
    }

    if (profilePage) {
        getPostsData(10, 0, 0, 0);
    }

    document.addEventListener('click', function(event) {
        event.stopPropagation();
        if (event.target && (event.target.class === 'post__link' || event.target.closest('.post__link'))) {
            const postId = event.target.closest('.post__link').dataset.postid;
            showModal(postId);
        }
    });

    //A modale aperta, innesca i listener
    document.addEventListener('click', function(event) {
        const postId = document.getElementById('postFull').dataset.postid;
        if (event.target && event.target.id === 'comments_show_btn') {
            loadComments(postId);
        }

        if (event.target && event.target.id == 'comment_submit') {
            const comment = document.querySelector(`#comment_input`).value;
            const commentFile = document.querySelector(`#comment_image`).files[0];
            postComment(postId, comment, commentFile);
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'modal-overlay') {
            //Chiusura modale
            document.getElementById('modal').classList.remove('open');
            document.getElementById('modal-overlay').style.display = 'none';
            $('#postFull').empty();
            document.querySelector('#comments_show_btn').removeAttribute('style');
            document.querySelector('#comments_list').replaceChildren();
        }
    });    

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'load_more') {
            document.querySelector('#load_more').remove();
            const isHomepage = document.getElementById('homepage') ? 1 : 0;
            getPostsData(10, 1, 1, isHomepage);
        }
    });


    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('post_like')) {
            insertLike(event);
        }
    });
    
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('post_comment')) {
            const postId = event.target.closest('.post_comment').dataset.postid;
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