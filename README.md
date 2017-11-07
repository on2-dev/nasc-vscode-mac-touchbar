# Nasc's Macbook Pro Touch Bar features for VSCode

This adds a few useful features to your Macbook Pro's touch bar while you are working in VSCode.
**Read the notes in the end of this document**

## Features

This is how your touchbar will look like:

![Touchbar visualization](nasc-macbook-pro-vscode-touch-bar.jpg)

The list of features are:

- Go to definition
- Add cursor above
- Add cursor below
- Run command
- Toggle side bar
- Toggle Panel/terminal
- Rename/replace all
- Duplicate lines
- Toggle white space characters
- Peek definition
- Show references
- Settings
- Indent
- Outdent
- Jump to matching bracket
- Block comment
- Comment line

## Settings

You can choose the buttons by setting the following settings.  
Please have in mind the limit of 6 active buttons (if you have the OS control strip enabled, 9 buttons if you don't) . More than that will break the layout and the buttons will not be visible.

- "nasc-touchbar.goToDefinition": (default _true_) Go to the function or variable definition
- "nasc-touchbar.addCursorAbove": (default _false_) Add a cursor in the line above
- "nasc-touchbar.addCursorBelow": (default _true_) Add a cursor in the line below
- "nasc-touchbar.selectNext": (default _true_) Adds a selection to the 
- "nasc-touchbar.toggleSidebar": (default _false_) Toggles the sidebar
- "nasc-touchbar.togglePanel": (default _true_) Toggles the panel in the bottom of the editor
- "nasc-touchbar.showCommands": (default _true_) Shows the _run command_ prompt
- "nasc-touchbar.rename": (default _true_) Rename (replace all) variable or function names
- "nasc-touchbar.copyLineDown": (default _false_) Duplicates the current line (or selected lines) 
- "nasc-touchbar.goToNext": (default _false_) Go to next match
- "nasc-touchbar.toggleWhiteSpace": (default _false_) Show or hide white spaces
- "nasc-touchbar.peekDefinition": (default _false_) Peek definition/declaration
- "nasc-touchbar.showReferences": (default _false_) List references who use the current symbol
- "nasc-touchbar.settings": (default _false_) Open user settings
- "nasc-touchbar.indent": (default _false_) Indent text
- "nasc-touchbar.outdent": (default _false_) Outdent text
- "nasc-touchbar.jumpToBracket": (default _false_) Jump to matching bracket
- "nasc-touchbar.blockComment": (default _false_) Toggles block comments ( /* ... */ ) for the current selection
- "nasc-touchbar.commentLine": (default _false_) Toggles line comments ( // ) for the current selection

## NOTES:

Important, if the buttons don't fit in the bar, they will not be shown (this is a current bug in VSCode support for the TouchBar and soon to be fixed).  
If the bar disappeared, see the options (ctrl+, or cmd+,), filter by "nasc" e adjust the settings.

Usually, if your are not using the "Strip" group of buttons, you can fit **9** buttons on it. If you have the OS's _Strip_ buttons enabled, you can fit **6** buttons.
