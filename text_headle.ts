import * as vscode from 'vscode';
const command_list: string[] = require('./server/command_list.js'); 

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'rwmodcode' }, 
        new MySemanticTokensProvider(),
        legend
    );

    context.subscriptions.push(disposable);
}

class MySemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
        const tokensBuilder = new vscode.SemanticTokensBuilder();
        const text = document.getText();
        const lines = text.split(/\r?\n/);

        lines.forEach((line, lineIndex) => {
            command_list.forEach(keyword => {
                const index = line.indexOf(keyword);
                if (index !== -1) {
                    const startIndex = index + keyword.length + 1; 
                    const endIndex = line.length;

                    tokensBuilder.push(
                        new vscode.Range(lineIndex, startIndex, lineIndex, endIndex),
                        'text' 
                    );
                }
            });
        });

        return tokensBuilder.build();
    }
}

const legend = new vscode.SemanticTokensLegend(['text']);
