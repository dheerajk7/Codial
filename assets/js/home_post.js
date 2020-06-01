{
    let createPost = function()
    {
        console.log('a');
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
                    },
                    error:function(error)
                    {
                        console.log(error.responseText);
                    }
                }
            );
        });
    }
    // createPost();
}