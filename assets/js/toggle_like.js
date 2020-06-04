//create class to toggle like when link is clicked using ajax

class ToggleLike
{
    constructor(toggleElement)
    {
        this.toggler =toggleElement;
        this.toggleLike();
    }

    toggleLike()
    {
        $(this.toggler).click(function(event)
        {
            event.preventDefault();
            let self = this;

            $.ajax(
                {
                    type:'POST',
                    url:$(self).attr('href'),
                }
            ).done(function(data)
            {
                let likeCount = parseInt($(self).attr('data-likes'));
                console.log(likeCount);
                if(data.data.deleted == true)
                {
                    likeCount -= 1;
                }
                else{
                    likeCount += 1;
                }
    
                $(self).attr('data-likes',likeCount);
                $(self).html(`${likeCount} likes`);
            })
            .fail(function(errData)
            {
                console.log('Error in adding like ',errData);
                return;
            });
        });

        
    }
}