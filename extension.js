const vscode = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');
const { activate } = require('./text_headle'); 

function activate(context) {
    const serverModule = context.asAbsolutePath('server/server.js');
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rwmodcode' }],
        diagnosticCollectionName: 'rwmodcode'
    };

    const serverOptions = {
        run: { 
            module: serverModule,
            transport: TransportKind.ipc,
            options: { cwd: context.extensionPath }
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: { 
                execArgv: ['--nolazy', '--inspect=6009'],
                cwd: context.extensionPath
            }
        }
    };

    const client = new LanguageClient(
        'rwmodcodeLanguageServer',
        'RWModCode Language Server',
        serverOptions,
        {
            documentSelector: [{ language: 'rwmodcode' }],
            outputChannel: vscode.window.createOutputChannel('RWModCode LSP')
        }
    );

    context.subscriptions.push(client.start());
}

module.exports = { activate };
