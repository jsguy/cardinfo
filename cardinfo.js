/*
	cardInfo - get information about a credit card

	Provided a credit card, (including a partial), the function returns information about your card, for example:

		cardInfo("5105105105105100");

	Returns an object with the following properties:

		{
			"cardCode":"CA",				// Type code of the card
			"cardName":"MasterCard",		// Name of the card
			"lengths":"16",					// Valid lengths for this card type
			"prefixes":"51,52,53,54,55",	// Valid prefixes for this card type
			"number":"5105105105105100",	// A trimmed and whitespaced-removed card number
			"valid":true					// If the number provided was valid (allows whitespace and dashes - use the returned number for a "clean" version of the card)
		}

	License: MIT http://www.opensource.org/licenses/mit-license.php
*/
;(function(context){
	var cardInfo = function(value) {
		//	Using cardCodes from http://developer.ean.com/general_info/Valid_Credit_Card_Types
		var cards = [
				{ cardName: "Mastercard", cardCode: "CA", lengths: "16", prefixes: "51,52,53,54,55" },
				{ cardName: "Visa", cardCode: "VI", lengths: "13,16", prefixes: "4" },
				{ cardName: "American Express", cardCode: "AX", lengths: "15", prefixes: "34,37" },
				{ cardName: "Carte Blanche", cardCode: "CB", lengths: "14", prefixes: "94,95,389" },
				{ cardName: "China Union Pay", cardCode: "CU", lengths: "16,17,18,19", prefixes: "62" },
				{ cardName: "Diners Club", cardCode: "DC", lengths: "14", prefixes: "304,305,36,38,60" },
				{ cardName: "Discover", cardCode: "DS", lengths: "16", prefixes: "60110,60112,60113,60114,60119" },
				{ cardName: "Electron", cardCode: "E", lengths: "16", prefixes: "450875,4844,4917,491880" },
				{ cardName: "JCB, Japan Credit Bureau", cardCode: "JC", lengths: "15,16", prefixes: "35" },
				{ cardName: "Dankort", cardCode: "N", lengths: "16", prefixes: "4571" },
				{ cardName: "Maestro", cardCode: "TO", lengths: "16,18,19", prefixes: "5020,5038,6304,6759" },
				{ cardName: "Delta", cardCode: "L", lengths: "16", prefixes: "4137,4462,45,46,48,49" },
				{ cardName: "Carte Bleue", cardCode: "R", lengths: "13,16", prefixes: "4" },
				{ cardName: "Switch", cardCode: "S", lengths: "16,18,19", prefixes: "4903,4911,4936,564182,63,6759" },
				{ cardName: "Carte Si", cardCode: "T", lengths: "16", prefixes: "4" }
			],
			cardNo, cardexp, myCard, i, j, k, exp, tmp, checksum = 0, charsValid = false, checksumValid = false, lengthValid = false, prefixValid = false, prefix = [], lengthOk, lengths = [];

		cardNo = value.replace(/[\s-]/g, ""); // remove spaces and dashes
		cardexp = /^[0-9]{12,19}$/;
		// has chars or wrong length
		if (cardexp.exec(cardNo)) {
			charsValid = true;
		}

		// strip down to digits
		cardNo = cardNo.replace(/\D/g, "");

		//	Work out the card type, using the prefix
		//	TODO: take into account the length first
		for (i = 0; i < cards.length; i+=1) {
			prefix = cards[i].prefixes.split(",");
			for (j = 0; j < prefix.length; j+=1) {
				exp = new RegExp("^" + prefix[j]);
				if (exp.test(cardNo)) {
					//	Test the length - if value is longer than given length, must be different card
					if(cards[i].lengths) {
						lengths = cards[i].lengths.split(",");
						for (k = 0; k < lengths.length; k+=1) {
							if (cardNo.length <= lengths[k]) {
								lengthOk = true;
							}
						}
					}

					if(lengthOk) {
						myCard = cards[i];
						break;
					}
				}
			}
			if(myCard) {
				break;
			}
		}

		// card type not found - create an empty object
		if(! myCard) {
			myCard = {};
		}

		//	Set the number
		myCard.number = cardNo;

		//	Do the checksum
		j = 1;
		for (i = cardNo.length - 1; i >= 0; i--) {
			tmp = Number(cardNo.charAt(i)) * j;
			if (tmp > 9) {
				checksum = checksum + 1;
				tmp = tmp - 10;
			}
			checksum = checksum + tmp;
			j = (j == 1)? 2: 1;
		}
		checksumValid = (checksum % 10 === 0); // is it mod10

		if(myCard.lengths) {
			lengths = myCard.lengths.split(",");
			for (j = 0; j < lengths.length; j+=1) {
				if (cardNo.length == lengths[j]){
					lengthValid = true;
				}
			}
		}

		if(myCard.prefixes) {
			prefix = myCard.prefixes.split(",");
			for (i = 0; i < prefix.length; i+=1) {
				exp = new RegExp("^" + prefix[i]);
				if (exp.test(cardNo)){
					prefixValid = true;
				}
			}
		}


		myCard.valid = !!(charsValid && checksumValid && prefixValid && lengthValid);

		return myCard? myCard: false;
	};

	context.cardInfo = cardInfo;

}(window));
