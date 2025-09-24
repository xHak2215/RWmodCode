const { createConnection, ProposedFeatures, CompletionItemKind } = require('vscode-languageserver/node');
const { TextDocuments, TextDocument } = require('vscode-languageserver-textdocument');
import { command_list } from "./syntaxes/command_list.js" //список с командами


const connection = createConnection(); 
const documents = new TextDocuments(TextDocument);


const VALIDATION_CONFIG = {
    allowedCommands: command_list,
    commandPattern: /^\s*([a-zA-Z0-9_]+)\s*:/,
    errorMessage: "Неизвестная команда '{command}'"
};

// База данных подсказок с полной документацией
const COMPLETION_ITEMS = {
    'name': { detail: 'Название юнита', docs: 'Уникальное имя бнита (строка)' },
    'class': { detail: 'класс', docs: 'Главный класс мода' },
    'price': { detail: 'Стоимость', docs: 'Цена в ресурсах (число)' },
    'mass': { detail: '  ', docs: '  ' },
    'techLevel': { detail: '  ', docs: '  ' },
    'buildSpeed': { detail: '  ', docs: '  ' },
    'radius': { detail: '  ', docs: '  ' },
    'isBio': { detail: '  ', docs: 'является ли юнит органическим (после смерти будет оставлять пятно)' },
    'isBug': { detail: '  ', docs: '  ' },
    'isBuilder': { detail: '  ', docs: '  ' },
    'maxHp': { detail: 'максимальное кол.во хп', docs: '  ' },
    'selfRegenRate': { detail: '  ', docs: '  ' },
    'maxShield': { detail: '  ', docs: '  ' },
    'startShieldAtZero': { detail: '  ', docs: '  ' },
    'energyStartingPercentage': { detail: '  ', docs: '  ' },
    'energyNeedsToRechargeToFull': { detail: '  ', docs: '  ' },
    'armor': { detail: 'защита', docs: 'защита уменьшает урон наносящийся юниту' },
    'armourMinDamageToKeep': { detail: '  ', docs: '  ' },
    'borrowResourcesWhileAlive': { detail: '  ', docs: '  ' },
    'generation_resources': { detail: '  ', docs: '  ' },
    'generation_active': { detail: '  ', docs: '  ' },
    'generation_credits': { detail: '  ', docs: '  ' },
    'generation_delay': { detail: '  ', docs: '  ' },
    'displayText': { detail: '  ', docs: '  ' },
    'displayDescription': { detail: '  ', docs: '  ' },
    'ShowInEditor': { detail: '  ', docs: '  ' },
    'MaxShield': { detail: '  ', docs: '  ' },
    'experemental': { detail: '  ', docs: '  ' },
    'ShieldRegen': { detail: '  ', docs: '  ' },
    'image': { detail: '  ', docs: '  ' },
    'image_turret': { detail: '  ', docs: '  ' },
    'dust_effect': { detail: '  ', docs: '  ' },
    'image_shadow': { detail: '  ', docs: '  ' },
    'canAttackNotTouchingWaterUnits': { detail: '  ', docs: '  ' },
    'turretMultiTargeting': { detail: '  ', docs: '  ' },
    'canAttackLandUnits': { detail: '  ', docs: '  ' },
    'canAttackUnderwaterUnits': { detail: '  ', docs: '  ' },
    'turretSize': { detail: '  ', docs: '  ' },
    'maxAttackRange': { detail: '  ', docs: '  ' },
    'projectile': { detail: '  ', docs: '  ' },
    'delay': { detail: '  ', docs: '  ' },
    'warmup': { detail: '  ', docs: '  ' },
    'recoilOffset': { detail: '  ', docs: '  ' },
    'recoilOutTime': { detail: '  ', docs: '  ' },
    'canShoot': { detail: '  ', docs: '  ' },
    'canAttackFlyingUnits': { detail: '  ', docs: '  ' },
    'laserDefenceEnergyUse': { detail: '  ', docs: '  ' },
    'targetGroundlife': { detail: '  ', docs: '  ' },
    'directDamage': { detail: '  ', docs: '  ' },
    'deflectionPower': { detail: '  ', docs: '  ' },
    'movementType': { detail: '  ', docs: '  ' },
    'moveSpeed': { detail: '  ', docs: '  ' },
    'maxTurnSpeed': { detail: '  ', docs: '  ' },
    'LAND': { detail: 'наземный', docs: 'наземный параметр  используется в определении типа юнита и в возможности атаковать данный тип ' },
    'AIR': { detail: 'воздушный', docs: 'летающий параметр  используется в определении типа юнита и в возможности атаковать данный тип ' },
    'HOVER': { detail: 'ховер(парящий)', docs: 'парящий ходит по зеле и воде параметр  используется в определении типа юнита и в возможности атаковать данный тип ' },
    'WATER': { detail: 'водный', docs: 'водный ходит по воде параметр  используется в определении типа юнита и в возможности атаковать данный тип ' },
    'OVER_CLIFF_WATER': { detail: '  ', docs: '  ' },
    'attach_x': { detail: '  ', docs: '  ' },
    'attach_y': { detail: '  ', docs: '  ' },
    'generation_delay': { detail: '  ', docs: '  ' },
    'generation_credits': { detail: '  ', docs: '  ' },
    'transportUnitsBlockAirAndWaterUnits': { detail: '  ', docs: '  ' },
    'transportUnitsRequireMovementType': { detail: '  ', docs: '  ' },
    'transportUnitsRequireTag': { detail: '  ', docs: 'По умолчанию истинно. Этот отряд может транспортировать только НАЗЕМНЫЕ отряды, если это правда. transportUnitsBlockAirAndWaterUnits: false ' },
    'maxTransportingUnits': { detail: '  ', docs: 'Количество слотов, которые имеет этот юнит для транспортировки других юнитов.' },
    'transportSlotsNeeded': { detail: '  ', docs: 'По умолчанию — 1. Количество слотов, которые этот юнит использует в транспорте, в экспериментальных случаях часто' },
    'isVisible': { detail: '  ', docs: ' ' },
    'requireConditional': { detail: '  ', docs: ' ' },
    'temporarilyAddTags': { detail: '  ', docs: ' ' },
    'isLocked': { detail: '  ', docs: ' ' },
    'isLockedMessage': { detail: '  ', docs: ' ' },
    'alsoQueueAction': { detail: '  ', docs: ' ' },
    'autoTrigger': { detail: '  ', docs: ' ' },
    'pos': { detail: '  ', docs: ' ' },
    'text': { detail: '  ', docs: ' ' },
    'addResources': { detail: '  ', docs: ' ' },
    'isLockedAltMessage': { detail: '  ', docs: ' ' },
    'description': { detail: '  ', docs: ' ' },
    'buildingSelectionOffset': { detail: '  ', docs: ' ' },
    'defineUnitMemory': { detail: '  ', docs: ' ' },       
    'slave': { detail: '  ', docs: ' ' },
    'shoot_sound': { detail: '  ', docs: ' ' },
    'shoot_flame': { detail: '  ', docs: ' ' },
    'shoot_light': { detail: '  ', docs: ' ' },
    'recoilReturnTime': { detail: '  ', docs: ' ' },       
    'idleSweepAngle': { detail: '  ', docs: ' ' },
    'idleSweepDelay': { detail: '  ', docs: ' ' },
    'idleSweepSpeed': { detail: '  ', docs: ' ' },
    'shootDelay': { detail: '  ', docs: ' ' },
    'attachedTo': { detail: '  ', docs: ' ' },
    'turretTurnSpeed': { detail: '  ', docs: ' ' },        
    'canAttack': { detail: '  ', docs: ' ' },
    'shadowOffsetX': { detail: '  ', docs: ' ' },
    'shadowOffsetY': { detail: '  ', docs: ' ' },
    'scaleFrom': { detail: '  ', docs: ' ' },
    'image_wreak': { detail: '  ', docs: ' ' },
    'total_frames': { detail: '  ', docs: ' ' },
    'alpha': { detail: '  ', docs: ' ' },
    'ySpeedRelativeRandom': { detail: '  ', docs: ' ' },
    'priority': { detail: '  ', docs: ' ' },
    'drawUnderUnits': { detail: '  ', docs: ' ' },
    'dirOffsetRandom': { detail: '  ', docs: ' ' },
    'hSpeed': { detail: '  ', docs: ' ' },
    'ySpeedRelative': { detail: '  ', docs: ' ' },
    'xSpeedRelativeRandom': { detail: '  ', docs: ' ' },
    'scaleTo': { detail: '  ', docs: ' ' },
    'life': { detail: '  ', docs: ' ' },
    'attachedToUnit': { detail: '  ', docs: ' ' },
    'isBuilding': { detail: '  ', docs: ' ' },
    'displayType': { detail: '  ', docs: ' ' },
    'displayDescription_ru': { detail: '  ', docs: ' ' },
    'constructionFootprint': { detail: '  ', docs: ' ' },
    'footprint': { detail: '  ', docs: ' ' },
    'fogOfWarSightRange': { detail: '  ', docs: ' ' },
    'displayDescription_zh': { detail: '  ', docs: ' ' },
    'autoTriggerCooldownTime': { detail: '  ', docs: ' ' },
    'autoTriggerCooldownTime_allowDangerousHighCPU': { detail: '  ', docs: ' ' },
    'addEnergy': { detail: '  ', docs: ' ' },
    'displayType': { detail: '  ', docs: ' ' },
    'displayText_ru': { detail: '  ', docs: ' ' },
    'displayText_zh': { detail: '  ', docs: ' ' },
    'shoot_sound': { detail: '  ', docs: ' ' },
    'shoot_flame': { detail: '  ', docs: ' ' },
    'shoot_light': { detail: '  ', docs: ' ' },
    'recoilReturnTime': { detail: '  ', docs: ' ' },
    'idleSweepAngle': { detail: '  ', docs: ' ' },
    'idleSweepDelay': { detail: '  ', docs: ' ' },
    'idleSweepSpeed': { detail: '  ', docs: ' ' },
    'buildingSelectionOffset': { detail: '  ', docs: ' ' },
    'experimental': { detail: '  ', docs: ' ' },
    'convertTo': { detail: '  ', docs: 'превращает текущего юнита в указанного' },
    'copyFrom': { detail: '  ', docs: ' ' },
    'text_zh': { detail: '  ', docs: ' ' },
    'text_ru': { detail: '  ', docs: ' ' },
    'text_es': { detail: '  ', docs: ' ' },
    'limitingRange': { detail: '  ', docs: ' ' },
    'resetAngle': { detail: '  ', docs: ' ' },
    'overrideAndReplace': { detail: '  ', docs: ' ' },
    'showInEditor': { detail: '  ', docs: ' ' },
    'areaDamage': { detail: '  ', docs: 'урон по радиусу' },
    'areaRadius': { detail: '  ', docs: 'радиус дамага' },
    'targetHeight': { detail: '  ', docs: ' ' },
    'builtFrom_1_name': { detail: '  ', docs: ' ' },
    'builtFrom_2_name': { detail: '  ', docs: ' ' },
    'turnAcceleration': { detail: '  ', docs: ' ' },
    'moveSlidingMode': { detail: '  ', docs: ' ' },
    'moveIgnoringBody': { detail: '  ', docs: ' ' },
    'reverseSpeedPercentage': { detail: '  ', docs: ' ' },
    'upgradedFrom': { detail: '  ', docs: ' ' },
    'whenBuilding_cannotMove': { detail: '  ', docs: ' ' },
    'whenBuilding_rotateTo': { detail: '  ', docs: ' ' },
    'whenBuilding_rotateTo_orBackwards': { detail: '  ', docs: ' ' },
    'speed': { detail: '  ', docs: 'скорость' },
    'drawSize': { detail: '  ', docs: ' ' },
    'description': { detail: '  ', docs: ' ' },
    'flame': { detail: '  ', docs: ' ' },   
    'hitSound': { detail: '  ', docs: ' ' },
    'instant': { detail: '  ', docs: ' ' }, 
    'speed': { detail: '  ', docs: ' ' },
    'drawSize': { detail: '  ', docs: ' ' },
    'turnSpeedAcceleration': { detail: '  ', docs: ' ' },
    'turnSpeed': { detail: '  ', docs: ' ' },
    'isFixedFiring': { detail: '  ', docs: ' ' },
    'turretRotateWithBoby': { detail: '  ', docs: ' ' },
    'tags': { detail: '  ', docs: ' ' },
    'builtFrom_1_pos': { detail: '  ', docs: ' ' },
    'dustEffect': { detail: '  ', docs: ' ' },
    'image_pl': { detail: '  ', docs: ' ' },
    'image_p2': { detail: '  ', docs: ' ' },
    'softCollisionOnALL': { detail: '  ', docs: ' ' },
    'softCollisionOnAll': { detail: '  ', docs: ' ' },
    'description': { detail: '  ', docs: ' ' },
    'teamColorsOnTurret': { detail: '  ', docs: ' ' },
    'lock_body_rotation_with_main_turret': { detail: '  ', docs: ' ' },
    'turretRotateWithBody': { detail: '  ', docs: ' ' },
    'shoot_sound_vol': { detail: '  ', docs: ' ' },
    'size': { detail: '  ', docs: ' ' },
    'largeHitEffect': { detail: '  ', docs: ' ' },
    'frame': { detail: '  ', docs: ' ' },
    'effectOnCreate': { detail: '  ', docs: ' ' },
    'lightSize': { detail: '  ', docs: ' ' },
    'animateFrameStart': { detail: '  ', docs: ' ' },
    'animateFrameEnd': { detail: '  ', docs: ' ' },
    'animateFramePingPong': { detail: '  ', docs: ' ' },
    'animateFrameSpeed': { detail: '  ', docs: ' ' },
    'fadeOut': { detail: '  ', docs: ' ' },
    'liveAfterAttachedDies': { detail: '  ', docs: ' ' },
    'physics': { detail: '  ', docs: ' ' },
    '[action_deploy]': { detail: '  ', docs: ' ' },
    'lightColor': { detail: '  ', docs: ' ' },
    '[core]': { detail: 'основная секция', docs: 'основная секция' },
    '[graphics]': { detail: '  ', docs: ' ' },
    '[action_deploy]': { detail: '  ', docs: ' ' },
    '[attack]': { detail: '  ', docs: ' ' },
    '[movement]': { detail: '  ', docs: ' ' },
    '[ai]': { detail: '  ', docs: ' ' },
    '[effect_flame]': { detail: '  ', docs: ' ' },
    '[comment_action_reload]': { detail: '  ', docs: ' ' },
    '[leg_': { detail: '  ', docs: ' ' },
    '[effect_smoke]': { detail: '  ', docs: ' ' },
    '[effect_muzzleFlame]': { detail: '  ', docs: ' ' },
    'dont_load' : { detail: '  ', docs: ' ' },
    'idleDir' : { detail: '  ', docs: ' ' },
    'invisible': { detail: '  ', docs: 'видел ли обект' },
    'CustomUnitMetadata': { detail: '  ', docs: ' ' },
    'displayRadius': { detail: '  ', docs: ' ' },
    'energyMax': { detail: '  ', docs: ' ' },
    'energyRegen': { detail: '  ', docs: ' ' },
    'movementEffect': { detail: '  ', docs: ' ' },
    'movementEffectRate': { detail: '  ', docs: ' ' },
    'explodeEffect': { detail: '  ', docs: ' ' },
    'targetGround': { detail: '  ', docs: ' ' },
    'targetGroundSpread': { detail: '  ', docs: ' ' },
    'targetSpeed': { detail: '  ', docs: ' ' },
    'trailEffect': { detail: '  ', docs: ' ' },
    'yOffsetRelative': { detail: '  ', docs: ' ' },
    'xOffsetRelative': { detail: '  ', docs: ' ' },
    'energyUsage': { detail: '  ', docs: ' ' },
    'dirSpeedRandom': { detail: '  ', docs: ' ' },
    'atmospheric': { detail: '  ', docs: ' ' },
    'buildPriority': { detail: '  ', docs: ' ' },
    'moveSlidingDir': { detail: '  ', docs: ' ' },
    'slowDeathFall': { detail: '  ', docs: ' ' },
    'fadeInTime': { detail: '  ', docs: ' ' },
    'hSpeedRandom': { detail: '  ', docs: ' ' }
    
}
connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind, // Используем syncKind из documents
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', ':', '(']
            },
            hoverProvider: true,
            diagnosticProvider: {
                identifier: 'rwmodcode',
                interFileDependencies: false,
                workspaceDiagnostics: false
            }
        }
    };
});

documents.onDidChangeContent((event) => {
    try {//зашита от подений сервера 
        function validateDocument(textDocument) {
            const text = textDocument.getText();
            const diagnostics = [];
        
            const lines = text.split('\n');
            for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
                const line = lines[lineNumber];
                const match = line.match(VALIDATION_CONFIG.commandPattern);
                
                if (match) {
                    const command = match[1];
                    const commandStartPos = match.index;
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
        
            connection.sendDiagnostics({
                uri: textDocument.uri,
                version: textDocument.version, // Важно для отслеживания версий
                diagnostics
            });
        } 

    } catch (error) {
        connection.console.error(`Validation failed: ${error.message}`);
    }
});




// 5. Обработчики документов с дебаг-логированием
documents.onDidOpen((event) => {
    connection.console.log(`Document opened: ${event.document.uri}`);
    validateDocument(event.document);
});

documents.onDidChangeContent((event) => {
    connection.console.log(`Document changed: ${event.document.uri}`);
    validateDocument(event.document);
});

// 6. Кэшированные подсказки
const completionItemsCache = Object.keys(COMPLETION_ITEMS).map(label => ({
    label,
    kind: CompletionItemKind.Keyword,
    data: label
}));

connection.onCompletion((textDocumentPosition) => {
    connection.console.log(`Completion requested for: ${textDocumentPosition.textDocument.uri}`);
    return { items: completionItemsCache };
});

// Обработка детализации подсказок
connection.onCompletionResolve((item) => {
    const details = COMPLETION_ITEMS[item.data];
    if (details) {
        item.detail = details.detail;
        item.documentation = {
            kind: 'markdown',
            value: details.docs || details.documentation || ''
        };
    }
    return item;
});

// Логирование инициализации
connection.onInitialized(() => {
    connection.console.log('RWModCode Language Server fully initialized');
});

// 9. Обработка ошибок
connection.onError((error) => {
    connection.console.error('Server error:', error.message);
});

// Запуск сервера
documents.listen(connection);
connection.listen();
