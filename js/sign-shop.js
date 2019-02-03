var moneyDummy = 'money';
		var currencySymbol = '$';
		var moneyDisplay = 'Money $'
		var distance = 5;
		var itemDummy = 'hasItems';

		// Generate the JSON for the sell sign
		function sell(item, itemName, price, quantity) {
			var hasItem = 'scores={' + itemDummy + '=' + quantity + '..}';
			var signObject = {
				BlockEntityTag: {
					// Fake clear a player's inventory to check how many of the item they have
					Text1: textLine('[Sell]', 'execute as @p[distance=..' + distance + '] store result score @s ' + itemDummy + ' run clear @s ' + item + ' 0', false),
					// If they have the item(s), clear them
					Text2: textLine(itemName, 'clear @p[' + hasItem + '] ' + item + ' ' + quantity, false),
					// Give the player money for the item(s) if the have them
					Text3: textLine(currencySymbol + price, 'scoreboard players add @p[' + hasItem + '] ' + moneyDummy + ' ' + price, [{
						'option': 'color',
						'value': 'green'
					}]),
					// Clear the player item dummy to ensure no sell spamming
					// I wish I could add a message here to say the player bought something,
					// but the item dummy needs to be cleared
					Text4: textLine('QTY: ' + quantity, '/scoreboard players set @p ' + itemDummy + ' 0', [{
						'option': 'color',
						'value': 'aqua'
					}])
				},
				display: {
					Name: JSON.stringify({
						text: "Sell " + itemName
					})
				}
			};
			signObject = '/give @p minecraft:sign' + JSON.stringify(signObject);
			return signObject;
		}

		// Generate the JSON for the buy sign
		function buy(item, itemName, price, qty) {
			var hasMoney = 'distance=..' + distance + ', scores={' + moneyDummy + '=' + price + '..}';
			var notEnoughMoney = 'distance=..' + distance + ', scores={' + moneyDummy + '=..' + (price - 1) + '}';
			var signObject = {
				BlockEntityTag: {
					// Tell the player they don't have enough money if they don't
					Text1: textLine('[Buy]', 'tellraw @p[' + notEnoughMoney + '] [{"text":"You don\'t have enough money to buy ' + qty + ' ' + itemName + ', it costs ' + currencySymbol + price + '", "color":"red"}]', false),
					// Tell the player they have enough money if they do
					Text2: textLine(itemName, 'tellraw @p[' + hasMoney + '] [{"text":"You Bought ' + qty + ' ' + itemName + ' for ' + currencySymbol + price + '", "color":"green"}]', false),
					// Give the player the item(s) if they had enough money
					Text3: textLine(currencySymbol + price, 'give @p[' + hasMoney + '] ' + item + ' ' + qty, [{
						'option': 'color',
						'value': 'green'
					}]),
					// Remove the money from the player's score
					Text4: textLine('QTY: ' + qty, 'scoreboard players remove @p[' + hasMoney + '] ' + moneyDummy + ' ' + price, [{
						'option': 'color',
						'value': 'aqua'
					}])

				},
				display: {
					Name: JSON.stringify({
						text: "Buy " + itemName
					})
				}
			};
			signObject = '/give @p minecraft:sign' + JSON.stringify(signObject);
			return signObject;
		}

		// A function planned for the future to allow the purchase of teleports
		function teleport(teleportName, teleportDummy, price, coords) {
			var hasMoney = 'distance=..' + distance + ', scores={' + moneyDummy + '=' + price + '..}';
			var canTp = 'distance=..' + distance + ', scores={' + moneyDummy + '=0..}';
			var signObject = {
				BlockEntityTag: {
					Text1: textLine('[Teleport]', 'scoreboard players set @p[' + hasMoney + '] ' + teleportDummy + ' 1', false),
					Text2: textLine(currencySymbol + price, 'scoreboard players remove @p[' + hasMoney + '] ' + moneyDummy + ' ' + price, false),
					Text3: textLine(teleportName, 'tp @p[scores={' + teleportDummy + '=1}] ' + coords, [{
						'option': 'color',
						'value': 'green'
					}]),
					Text4: textLine('', 'scoreboard players set @a ' + teleportDummy + ' 0', false)
				},
				display: {
					Name: JSON.stringify({
						text: "Teleport to " + teleportName
					})
				}
			};
			signObject = '/give @p minecraft:sign' + JSON.stringify(signObject);
			return signObject;
		}

		function setup() {
			var signObject = {
				BlockEntityTag: {
					Text1: textLine('[Sign Shop]', 'scoreboard objectives add ' + moneyDummy + ' dummy ["' + moneyDisplay + '"]', false),
					Text2: textLine('Setup Commands', 'scoreboard objectives setdisplay sidebar ' + moneyDummy, false),
					Text3: textLine('Made By:', 'scoreboard objectives add ' + itemDummy + ' dummy', [{
						'option': 'color',
						'value': 'green'
					}]),
					Text4: textLine('Vangaurdan', 'tellraw @p [{"text":"Thanks for using vangaurdan\'s sign shop generator.", "color":"green"}]', [{
						'option': 'color',
						'value': 'aqua'
					}])
				},
				display: {
					Name: JSON.stringify({
						text: "Setup vangaurdan's Sign Shop"
					})
				}
			};
			signObject = '/give @p minecraft:sign' + JSON.stringify(signObject);
			return signObject;
		}

		// Generate a line of text with or without a command for a sign
		function textLine(text, command, options) {
			var line = {
				"text": text,
				"clickEvent": {
					action: "run_command",
					value: command
				}
			};
			if (options) {
				for (i = 0; i < options.length; i++) {
					line[options[i].option] = options[i].value;
				}
			}
			return JSON.stringify(line);
		}