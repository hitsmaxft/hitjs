(function(){
    var old_link = $('#title_label a');
    if( null===old_link ) {
        return;
    }
    var save_link = $("<a style=\"color:red\">[<strong> Save </strong>] </a>").attr('href','javascript:void();');

    function bind_save_page(link){
        return function (){
            var d=document,z=d.createElement('script'),b=d.body;
            try{
                if(!b)throw(0);
                d.title='(Saving...) '+d.title;
                z.setAttribute('src','http://www.instapaper.com/j/oFMNViNQBStg?u='+encodeURIComponent(link)+'&t='+(new Date().getTime()));
                b.appendChild(z);
            }catch(e){
                alert(e.toString() + 'Please wait until the page has loaded. link'+link);
            }
        };
    };

    save_link.click(bind_save_page(old_link.attr('href')));
    $('#title_label').prepend(save_link);
})();
