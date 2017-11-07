const vscode = require('vscode');
const GO_MODE = { language: 'js', scheme: 'file' };

class GoDefinitionProvider {
    provideDefinition () {
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
        if (selection.start.line === 0) {
            return
        }
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

function activate(context) {
    const go2Def = new GoDefinitionProvider()
    const aCA = vscode.commands.registerCommand('nasc.touchBar.addCursorAbove', function () {
        addCursor('above')
    })
    const aCB = vscode.commands.registerCommand('nasc.touchBar.addCursorBelow', function () {
        addCursor('below')
    })

    vscode.commands.registerCommand('nasc.touchBar.closeGroup', function () {
        vscode.commands.executeCommand('setContext', 'enabledGroup', false)
        vscode.commands.executeCommand('setContext', 'enabledFuncGroup', false)
        vscode.commands.executeCommand('setContext', 'enabledSrcGroup', false)
        vscode.commands.executeCommand('setContext', 'enabledEditorGroup', false)
        vscode.commands.executeCommand('setContext', 'enabledCursorsGroup', false)
        // vscode.workspace.getConfiguration().update('nasc-touchbar.enabledGroup', 0)
    })
    vscode.commands.registerCommand('nasc.touchBar.enableFuncGroup', function () {
        vscode.commands.executeCommand('setContext', 'enabledGroup', true)
        vscode.commands.executeCommand('setContext', 'enabledFuncGroup', true)
        // vscode.workspace.getConfiguration().update('nasc-touchbar.enabledGroup', 1)
    })
    vscode.commands.registerCommand('nasc.touchBar.enableSrcGroup', function () {
        vscode.commands.executeCommand('setContext', 'enabledGroup', true)
        vscode.commands.executeCommand('setContext', 'enabledSrcGroup', true)
        // vscode.workspace.getConfiguration().update('nasc-touchbar.enabledGroup', 2)
    })
    vscode.commands.registerCommand('nasc.touchBar.enableEditorGroup', function () {
        vscode.commands.executeCommand('setContext', 'enabledGroup', true)
        vscode.commands.executeCommand('setContext', 'enabledEditorGroup', true)
        // vscode.workspace.getConfiguration().update('nasc-touchbar.enabledGroup', 3)
    })
    vscode.commands.registerCommand('nasc.touchBar.enableCursorsGroup', function () {
        vscode.commands.executeCommand('setContext', 'enabledGroup', true)
        vscode.commands.executeCommand('setContext', 'enabledCursorsGroup', true)
        // vscode.workspace.getConfiguration().update('nasc-touchbar.enabledGroup', 4)
    })

    vscode.commands.registerCommand('nasc.touchBar.goToDefinition', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var position = editor.selection.active;

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
    context.subscriptions.push(aCB)
    // context.subscriptions.push(eFG)
    context.subscriptions.push(prov);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
