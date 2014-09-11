BlockquoteEditor
===============================

BlockquoteEditor is a MediumEditor plugin to replace built-in behavior for blockquotes.

This plugin wraps selected elements in blockquote tags rather than using the native formatBlock command,
which strips internal block elements.

## Example usage:

```
	var editor = new MediumEditor([el], {
		buttonLabels: 'fontawesome',
		buttons: ['bold', 'italic', 'bq'],
		forcePlainText: false,
		extensions: {
			bq: new BlockquoteEditor()
		}
	});
```


## The problem with formatBlock and block quotes

Consider this markup:

```
<p>Select these two paragraphs.</p>
<p>And make a block quote.</p>
```

Using the native contenteditable formatBlock command, this will become:

```
<blockquote>
  Select these two paragraphs.<br/>
  And make a block quote.
</blockquote>
```

Adding insult to injury, if you place your cursor before the BR tag and hit return, you will wind up with TWO blockquotes:

```
<blockquote>Select these two paragraphs.</blockquote>
<blockquote>And make a block quote.</blockquote>
```

## BlockquoteEditor's way

This markup:

```
<p>Select these two paragraphs.</p>
<p>And make a block quote.</p>
```

Becomes:

```
<blockquote>
  <p>Select these two paragraphs.</p>
  <p>And make a block quote.</p>
</blockquote>
```

And as an added bonus, placing your cursor at the end of the first paragraph and hitting return, will get you:

```
<blockquote>
  <p>Select these two paragraphs.</p>
  <p>[CURSOR HERE]</p>
  <p>And make a block quote.</p>
</blockquote>
```

