(jQuery)(function($) { 
    /* ================ CONTENT TABS ================ */
    (function() {
        $('.tabs').each(function() {
            var $tabLis = $(this).find('li');
            var $tabContent = $(this).next('.tab-content-wrap').find('.tab-content');

            $tabContent.hide();
            $tabLis.first().addClass('active').show();
            $tabContent.first().show();
        });

        $('.tabs').on('click', 'li', function(e) {
            var $this = $(this);
            var parentUL = $this.parent();
            var tabContent = parentUL.next('.tab-content-wrap');

            parentUL.children().removeClass('active');
            $this.addClass('active');

            tabContent.find('.tab-content').hide();
            var showById = $($this.find('a').attr('href'));
            tabContent.find(showById).fadeIn();

            e.preventDefault();
        });
    })();
});
