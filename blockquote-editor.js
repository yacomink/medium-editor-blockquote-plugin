/*
	BlockquoteEditor is a MediumEditor plugin to replace built-in behavior for blockquotes.

	This plugin wraps selected elements in blockquote tags rather than using the native formatBlock command,
	which strips internal block elements. I.e. in the native implementation, it was impossible to make a blockquote
	by selecting two or more paragraphs.

	Example usage:

		var editor = new MediumEditor([el], {
			buttonLabels: 'fontawesome',
			buttons: ['bold', 'italic', 'bq'],
			forcePlainText: false,
			extensions: {
				bq: new BlockquoteEditor()
			}
		});

*/
var BlockquoteEditor = function () {

	var self = this;

    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action medium-editor-action-quote';
    this.button.innerHTML = '<i class="fa fa-quote-left"></i>';
    this.button.onclick = function(e) { self.onClick.call(self, e); };

    this.up = function( element, desired_tag_name ) {

	    var elements = [];

	    do {
	      if (element.nodeType == 1){
	      	if (element.nodeName.toLowerCase() == desired_tag_name.toLowerCase())
	      	{
	      		return element;
	      	}
	      }
	    } while (element = element.parentNode);

	    return false;
    }

};

BlockquoteEditor.prototype.onClick = function() {

	var range = window.getSelection().getRangeAt(0);

	var bq = this.up( range.startContainer, 'blockquote' );
	if ( bq )
	{
		// un-quote
		bq.replace( bq.innerHTML );

	}
	else
	{
		// expand range out to the the edges of the parent blocks
		var start = range.startContainer.parentNode,
			end = range.endContainer.parentNode;

		// If the range starts with a paragraph that begins with an inline element like <i> or <a>
		// the start container will be a text node. Find the containing paragraph.
		var start_in_p = this.up(range.startContainer, 'p'),
			end_in_p = this.up(range.endContainer, 'p');
		if (range.startContainer.nodeName == '#text' && start_in_p ) start = start_in_p;
		if (range.endContainer.nodeName == '#text' && end_in_p) end = end_in_p;

		if (range.endOffset == 0 && end) {
			// if you double-click to select an entire line, the selection ends just inside the next block
			// back up out of that block.
			range.setEndBefore( range.endContainer )
		} else if (end) {
			range.setEndAfter( end );
		}
		if (start) {
			range.setStartBefore( start );
		}

		bq = document.createElement('blockquote');
		range.surroundContents(bq);
	}

};
BlockquoteEditor.prototype.getButton = function() {
    return this.button;
};
BlockquoteEditor.prototype.checkState = function (node) {
    if(this.up(node, 'blockquote')) {
        this.button.classList.add('medium-editor-button-active');
    }
};

BlockquoteEditor.prototype.coverAll = function(selection) {
	var ranges = [];
    for(var i=0; i<this.rangeCount; i++) {
        var range = this.getRangeAt(i);
        range.setStart(range.startContainer, 0);
        range.setEnd(range.endContainer, range.endContainer.nodeValue.length);
        ranges.push(range);
    }
    selection.removeAllRanges();
    for(var i=0; i<ranges.length; i++) {
        selection.addRange(ranges[i]);
    }
}
