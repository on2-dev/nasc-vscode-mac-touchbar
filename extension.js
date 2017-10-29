// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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

// function activate(ctx) {
//     ctx.subscriptions.push(
//         vscode.languages.registerDefinitionProvider(
//             GO_MODE, new GoDefinitionProvider()));
// }






// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const go2Def = new GoDefinitionProvider()
//     // Use the console to output diagnostic information (console.log) and errors (console.error)
//     // This line of code will only be executed once when your extension is activated
//     console.log('Congratulations, your extension "nasc-touchbar" is now active!');

//     // The command has been defined in the package.json file
//     // Now provide the implementation of the command with  registerCommand
//     // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('nasc.touchBar.goToDefinition', function () {
//         // The code you place here will be executed every time your command is executed
// debugger
        var editor = vscode.window.activeTextEditor;
        // if (!editor) {
        //     return; // No open text editor
        // }
        
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        var position = editor.selection.active;

//         editor.action.goToTypeDefinition()
        
//         // Display a message box to the user
//         vscode.window.showInformationMessage('Selected characters: ' + text.length);        
        // vscode.window.showInformationMessage('Hello World!');
        // debugger
        vscode.commands.executeCommand('vscode.executeDefinitionProvider', 
            editor.document.uri,
            position
        ).then(result => {
            if (result[0]) {
                let found = result[0]
                // debugger
                var newPositionS = position.with(found.range._start.line, found.range._start.character);
                var newPositionE = position.with(found.range._end.line, found.range._end.character);
                var newSelection = new vscode.Selection(newPositionS, newPositionE);

                vscode.commands.executeCommand('vscode.open', found.uri, 50).then(result => {
                    var editor = vscode.window.activeTextEditor;
                    editor.selection = newSelection
                }, err => {
                    // debugger
                })//.catch(err => {
                //     debugger
                // })
            }
            return true
        })//.catch(e=>{
        //     debugger
        // })
        // vscode.executeDefinitionProvider(go2Def)
        // console.log(vscode.languages, go2Def, prov)
    });
    const prov = vscode.languages.registerDefinitionProvider(
        GO_MODE, go2Def
    )
    context.subscriptions.push(
        prov
    );

    // context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;