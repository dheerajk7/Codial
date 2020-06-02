
{
    let createPost = function()
    {
        let newPostForm = $('#new-post-form');
        
        //prevent default behaviour
        newPostForm.submit(function(event)
        {
            event.preventDefault();

            $.ajax(
                {
                    type:'post',
                    url:'/posts/add-post',
                    data:newPostForm.serialize(),
                    success:function(data)
                    {
                        console.log(data);
                        let newPost = createPostDOM(data.data);
                        console.log(newPost);
                        $('#text-input')[0].value = '';
                        $('#post-item-container>ul').prepend(newPost);
                        deletePost($(' .delete-post-button', newPost));  
                    },
                    error:function(error)
                    {
                        console.log(error.responseText);
                    }
                }
            );
        });
    }
    createPost();

    let createPostDOM = function(data)
    {
        return $(`<li id="post-${data.post._id}">
            <div class="post-content">
                <div>${data.post.content}</div><div>${data.userName}</div>
                    <div><a class="delete-post-button" href="/posts/delete/${data.post._id}">Delete</a></div>
            </div>
            <div class="comment-list>
                <ul id="post-comment-${data.post.id}">
                </ul>
            </div>
            <div class="comment-section">
                <div>Comment</div>
                <for action="/posts/add-comment" method="POST">
                    <input type="text" name="comment" placeholder="Write Comment : ">
                    <input type="hidden" name="post" value="${data.post.id}">
                    <input type="submit" value="Add Comment">
                </form>
            </div>
        </li>;`);
    }

    let deletePost = function(deleteLink)
    {
        $(deleteLink).click(function(event)
        {
            event.preventDefault();

            $.ajax(
                {
                    type:'get',
                    url:$(deleteLink).prop('href'),
                    success:function(data)
                    {
                        $(`#post-${data.data.post_id}`).remove();
                    },
                    error:function(error)
                    {
                        console.log(error.responseText);
                    }
                }
            );
        });
    }
}