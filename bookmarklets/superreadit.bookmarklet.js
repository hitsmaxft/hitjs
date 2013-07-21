/*
 * # SuperReadIt
 *  switch to textview provided by instapaper
 *
 *  v0.1 only supports googlereader
 *  v0.2 add support for normal page
 *
 * #TODO
 * v0.3.1
 * v0.3.1 -readability support-;external script loadding
 */

(function () {
        do {
            if ( /.*www\.google\.com\/reader.*/.test(document.location.href)) {
                /*textview in google reader*/
                var entry_reading=document.getElementsByClassName('entry expanded');
                if( 0 >= entry_reading.length ) break;
                var $title_link = entry_reading[0].getElementsByClassName('entry-title-link');
                if( 0 >= $title_link.length) break;
                window.open('http://www.instapaper.com/text?u=' + encodeURIComponent($title_link[0].href));
                break;
            }

            /*for textview in normal webpage*/
            window.location.href = 'http://www.instapaper.com/text?u=' + encodeURIComponent(window.location.href);
            break;
        }
        while(0);
    }
)();
