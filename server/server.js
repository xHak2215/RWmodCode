const { createConnection, CompletionItemKind, TextDocuments } = require('vscode-languageserver');
const { TextDocument } = require('vscode-languageserver-textdocument');
const fs = require('fs');
const path = require('path');

const { COMPLETION_ITEMS } = require('./commands.js');

const connection = createConnection(); 
const documents = new TextDocuments(TextDocument);
 
const COMPLETION_ITEMS_LIST_KEY = Object.keys(COMPLETION_ITEMS);

const VALIDATION_CONFIG = {
    allowedCommands: Object.keys(COMPLETION_ITEMS),
    commandPattern: /^\s*([a-zA-Z0-9_]+)\s*:/,
    errorMessage: "Неизвестная команда '{command}'"
};


connection.onInitialize(() => {
  connection.console.log('RWModCode Language Server fully initialized');
    return {
        capabilities: {
            textDocumentSync: documents.syncKind, // Используем syncKind из documents
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ':', '(', '=']
            },
            hoverProvider: false,
            diagnosticProvider: {
                identifier: 'rwmodcode',
                interFileDependencies: false,
                workspaceDiagnostics: false
            }
        }
    };
});

// Функция валидации — модульная (доступна из любых обработчиков)
function validateDocument(textDocument) {
  const text = textDocument.getText();
  const diagnostics = [];

  const lines = text.split(/\r?\n/);
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber];
    const match = line.match(VALIDATION_CONFIG.commandPattern);
    if (match) {
      const command = match[1];
      const commandStartPos = match.index || 0;
      const commandEndPos = commandStartPos + command.length;

      if (!VALIDATION_CONFIG.allowedCommands.includes(command)) {
        diagnostics.push({
          severity: 2, // Warning
          range: {
            start: { line: lineNumber, character: commandStartPos },
            end: { line: lineNumber, character: commandEndPos }
          },
          message: VALIDATION_CONFIG.errorMessage.replace('{command}', command),
          source: 'rwmodcode'
        });
      }
    }
  }

  // Отправляем диагностические сообщения клиенту
  connection.sendDiagnostics({
    uri: textDocument.uri,
    diagnostics
  });
}

connection.onRequest('textDocument/diagnostic', async (params) => {
  // params: { textDocument: { uri }, previousResultId? }
  const uri = params.textDocument && params.textDocument.uri;
  if (!uri) return { items: [] };

  const doc = documents.get(uri);
  if (!doc) return { items: [] };

  // Выполнить ту же валидацию, что в validateDocument, и вернуть результат
  const diagnostics = [];
  const lines = doc.getText().split(/\r?\n/);
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber];
    const match = line.match(VALIDATION_CONFIG.commandPattern);
    if (match) {
      const command = match[1];
      const commandStartPos = match.index || 0;
      const commandEndPos = commandStartPos + command.length;
      if (!VALIDATION_CONFIG.allowedCommands.includes(command)) {
        diagnostics.push({
          severity: 2,
          range: {
            start: { line: lineNumber, character: commandStartPos },
            end: { line: lineNumber, character: commandEndPos }
          },
          message: VALIDATION_CONFIG.errorMessage.replace('{command}', command),
          source: 'rwmodcode'
        });
      }
    }
  }

  // Формат ответа для Pull Diagnostics: массив элементов с uri и diagnostics
  return { items: [{ uri, diagnostics }] };
});

function listDirectory(dirPath) {
    const temp = {};
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: false });
        /* только когда withFileTypes == true но эта чать мне пока не нужна 
        return entries.map(entry => ({
            name: entry.name,
            isDirectory: entry.isDirectory(),
            isFile: entry.isFile()
        }));
        */
      for (const item of entries) {
        temp[item] = { detail: 'файл/папка', docs: '' };
      }

       return temp;
    } catch (error) {
        console.error(`Ошибка чтения директории: ${error}`);
        return temp;
    }
}


//documents.onDidOpen((event) => {
//    connection.console.log(`Document opened: ${event.document.uri}`);
//    validateDocument(event.document);
//});

documents.onDidChangeContent((event) => {
    connection.console.log(`Document changed: ${event.document.uri}`);
    //validateDocument(event.document);
});

connection.onCompletion((textDocumentPosition) => {
    const completionItemsCache = [...COMPLETION_ITEMS_LIST_KEY, ...Object.keys(listDirectory("./"))].map(label => ({
      label,
      kind: CompletionItemKind.Keyword,
      data: label
    }));

    connection.console.log(`Completion requested for: ${textDocumentPosition.textDocument.uri}`);
    return { items: completionItemsCache};
});

// Обработка детализации подсказок
connection.onCompletionResolve((item) => {
    const FILE_AND_COMPLETION_ITEMS = {...COMPLETION_ITEMS, ...listDirectory("./")};
    const details = FILE_AND_COMPLETION_ITEMS[item.data];
    if (details && details.detail != '  ') {
        item.detail = details.detail;
        item.documentation = {
            kind: 'markdown',
            value: details.docs || details.documentation || ''
        };
    } else {
      connection.console.log(details.detail);
    }
    return item;
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});


// Запуск сервера
documents.listen(connection);
connection.listen();