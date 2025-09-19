import * as vscode from 'vscode';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node';
import { MySemanticTokensProvider, legend } from '/text_headle'; 

export function activate(context) {
    console.log("запуск проверка");
    const serverModule = context.asAbsolutePath('server/server.js');
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'rwmodcode' }],
        diagnosticCollectionName: 'rwmodcode'
    };

    const disposable = vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'rwmodcode' }, 
        new MySemanticTokensProvider(),
        legend
    );

    context.subscriptions.push(disposable);

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

    // Запускаем клиент и добавляем его в subscriptions
    client.start().then(() => {
        context.subscriptions.push(client);
        console.info("start client");
    }).catch(err => {
        console.error('Failed to start language client:', err);
    });
}
