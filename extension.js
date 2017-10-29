const vscode = require('vscode');
const GO_MODE = { language: 'js', scheme: 'file' };

class GoDefinitionProvider {
    provideDefinition () {
        debugger
        return new Promise((resolve, reject) => {
            return {
                document: vscode.TextDocument,
                position: vscode.Position,
                token: vscode.CancellationToken
            }
        })
    }
}

function getTextFromLine (selection) {
    let position = selection.active;
    let newPositionA = position.with(selection.line, 0);
    let newPositionB = position.with(selection.line, selection.character);
    let newSelection = new vscode.Selection(newPositionA, newPositionB)
    const editor = vscode.window.activeTextEditor;
    return editor.document.getText(newSelection)
}
function countTabs (sel) {
    let matching = getTextFromLine(sel).match(/\t/g)
    return matching ? matching.length : 0
}

function addCursor (direction) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    var position = editor.selection.active;
    var selections = editor.selections
    var selection
    
    if (selections.length > 1) {
        selections = selections.sort((a, b) => {
            return a.start.line > b.start.line
        })
        selection = direction === 'above' ? selections[0] : selections[selections.length -1]
        position = selection.active
    } else {
        selection = selections[0]
    }
    var diffBase = direction === 'above' ? -1 : 1
    var newPosition = position.with(position.line + diffBase, position.character);
    var newSelection = new vscode.Selection(newPosition, newPosition);

    if (!editor.options.insertSpaces) {
        let tabs = countTabs(selection)
        let tabs2 = countTabs(newSelection)
        let diff = (tabs - tabs2)
        
        if (Math.abs(diff) > 0) {
            diff = diff * editor.options.tabSize - diff
        }
        newPosition = position.with(position.line + diffBase, position.character + diff);
        newSelection = new vscode.Selection(newPosition, newPosition);
    }
    let ar = Array.from(selections)
    ar.push(newSelection)
    editor.selections = ar
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    const go2Def = new GoDefinitionProvider()
//     // Use the console to output diagnostic information (console.log) and errors (console.error)
//     // This line of code will only be executed once when your extension is activated
//     console.log('Congratulations, your extension "nasc-touchbar" is now active!');
    const aCA = vscode.commands.registerCommand('nasc.touchBar.addCursorAbove', function () {
        addCursor('above')
    })
    const aCB = vscode.commands.registerCommand('nasc.touchBar.addCursorBellow', function () {
        addCursor('bellow')
    })

//     // The command has been defined in the package.json file
//     // Now provide the implementation of the command with  registerCommand
//     // The commandId parameter must match the command field in package.json
    vscode.commands.registerCommand('nasc.touchBar.goToDefinition', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }
        
        // var selection = editor.selection;
        // var text = editor.document.getText(selection);
        var position = editor.selection.active;

//         vscode.window.showInformationMessage('Selected characters: ' + text.length);        
        vscode.commands.executeCommand('vscode.executeDefinitionProvider', 
            editor.document.uri,
            position
        ).then(result => {
            if (result[0]) {
                let found = result[0]
                var newPositionS = position.with(found.range._start.line, found.range._start.character);
                var newPositionE = position.with(found.range._end.line, found.range._end.character);
                var newSelection = new vscode.Selection(newPositionS, newPositionE);

                vscode.commands.executeCommand('vscode.open', found.uri, 50).then(result => {
                    var editor = vscode.window.activeTextEditor;
                    editor.selection = newSelection
                    vscode.commands.executeCommand('revealLine', {
                        lineNumber: newSelection.start.line,
                        at: 'center'
                    }).then(result => {
                    }, err => {
                    })
                }, err => {
                    console.log(err)
                })
            }
            return true
        })
    });
    const prov = vscode.languages.registerDefinitionProvider(
        GO_MODE, go2Def
    )
    context.subscriptions.push(aCA)
    context.subscriptions.push(
        prov
    );
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;