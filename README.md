# RWModCode VS Code (rusted warfare)


>RWModCode - это плагин для упрошения разработки модов для Rusted Warfare

## Возможности

- Подсветка синтаксиса
- подсказки
- Валидация

1. **Валидация**:
   - Проверка обязательных полей
   - Валидация типов данных

подсветка:

![noimg](images/premer.png)

## Установка

1. Откройте Extensions (Ctrl+Shift+X)
2. Найдите "RWModCode"
3. Нажмите Install

## Настройки

```json
"rwmodcode.maxSuggestions": 50,
"rwmodcode.enableLinting": true
```

## сборка из исхоников

```
npm install -g @vscode/vsce

vsce package 
```

## Ссылки
- [Github](https://github.com/xHak2215/RWmodCode)
