(function($){
	// Tooltip support.
    $(function() {
		$('.bsf-docs-bot-field-help').hover(function(){
			var tip_wrap = $(this).closest('.bsf-docs-bot-table-data');
			closest_tooltip = tip_wrap.find('.bsf-docs-bot-tooltip-text');
			closest_tooltip.toggleClass('display_tool_tip');
	    });
	});
})(jQuery);
