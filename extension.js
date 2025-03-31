const vscode = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

function activate(context) {
    const serverModule = context.asAbsolutePath('server/server.js');
    
    const serverOptions = {
        run: { 
            module: serverModule,
            transport: TransportKind.ipc,
            options: { cwd: context.extensionPath },
            completionProvider: {
                resolveProvider: true // Теперь сервер поддерживает разрешение
            }
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

    client.start();
}

module.exports = { activate };