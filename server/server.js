const { createConnection, ProposedFeatures } = require('vscode-languageserver/node');
const { TextDocuments } = require('vscode-languageserver');
const { TextDocument } = require('vscode-languageserver-textdocument');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

// Конфигурация сервера
connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: 1,  // Full sync
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ['.', '(', ')', ':'],
                resolveProvider: true
            },
            hoverProvider: true
        }
    };
});

// База данных подсказок
const COMPLETION_ITEMS = {
'name': { detail: 'Название юнита', docs: 'Уникальное имя бнита (строка)' },
'class': { detail: 'класс', docs: 'Главный класс мода' },
'price': { detail: 'Стоимость', docs: 'Цена в ресурсах (число)' },
'mass': { detail: '  ', docs: '  ' },
'techLevel': { detail: '  ', docs: '  ' },
'buildSpeed': { detail: '  ', docs: '  ' },
'radius': { detail: '  ', docs: '  ' },
'isBio': { detail: '  ', docs: '  ' },
'isBug': { detail: '  ', docs: '  ' },
'isBuilder': { detail: '  ', docs: '  ' },
'maxHp': { detail: '  ', docs: '  ' },
'selfRegenRate': { detail: '  ', docs: '  ' },
'maxShield': { detail: '  ', docs: '  ' },
'startShieldAtZero': { detail: '  ', docs: '  ' },
'energyStartingPercentage': { detail: '  ', docs: '  ' },
'energyNeedsToRechargeToFull': { detail: '  ', docs: '  ' },
'armor': { detail: '  ', docs: '  ' },
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
'LAND': { detail: '  ', docs: '  ' },
'AIR': { detail: '  ', docs: '  ' },
'HOVER': { detail: '  ', docs: '  ' },
'WATER': { detail: '  ', docs: '  ' },
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
}

connection.onInitialize(() => ({
    capabilities: {
        completionProvider: {
            triggerCharacters: ['.', ':'],
            resolveProvider: false // Отключаем двухэтапный процесс
        }
    }
}));

connection.onCompletion(() => ({
    items: Object.keys(COMPLETION_ITEMS).map(label => ({
        label,
        kind: COMPLETION_ITEMS[label].kind,
        detail: COMPLETION_ITEMS[label].detail,
        documentation: {
            kind: 'markdown',
            value: COMPLETION_ITEMS[label].documentation
        }
    }))
}));

connection.onCompletionResolve(item => {
    const details = COMPLETION_ITEMS[item.data];
    if (details) {
        item.detail = details.detail;
        item.documentation = details.docs;
    }
    return item;
});



// Запуск сервера
documents.listen(connection);
connection.listen();