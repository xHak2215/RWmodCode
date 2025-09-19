import * as vscode from 'vscode';
const command_list: string[] = require('./syntaxes/command_list.js');

export class MySemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
        const tokensBuilder = new vscode.SemanticTokensBuilder();
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        console.info(lines + ' оброботка текста');

        lines.forEach((line, lineIndex) => {
            command_list.forEach(keyword => {
                // Используем регулярное выражение для проверки ключевого слова
                const regex = new RegExp(`(?<!\\d)${keyword}(?!\\d)`);
                const match = line.match(regex);
                
                if (match) {
                    // Найдите позицию двоеточия
                    const index = match.index;
                    const colonIndex = line.indexOf(':', index);
                    if (colonIndex !== -1) {
                        // Подсвечиваем текст после двоеточия
                        const startIndex = colonIndex + 1; // Начинаем с символа после двоеточия
                        const endIndex = line.length; // Конец строки

                        // Удаляем пробелы в начале текста после двоеточия
                        const trimmedText = line.substring(startIndex).trim();
                        const trimmedStartIndex = startIndex + (line.substring(startIndex).indexOf(trimmedText));
                        console.info(lineIndex, trimmedStartIndex, lineIndex, endIndex)
                        tokensBuilder.push(
                            new vscode.Range(lineIndex, trimmedStartIndex, lineIndex, endIndex),
                            'text'
                        );
                    }
                }
            });
        });

        return tokensBuilder.build();
    }
}

export const legend = new vscode.SemanticTokensLegend(['text']);
