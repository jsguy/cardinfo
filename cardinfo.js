/*
	cardInfo - get information about a credit card

	Provided a credit card, (including a partial), the function returns information about your card, for example:

		cardInfo("5105105105105100");

	Returns an object with the following properties:

		{
			"cardType":"CA",				// Type code of the card
			"cardName":"MasterCard",		// Name of the card
			"lengths":"16",					// Valid lengths for this card type
			"prefixes":"51,52,53,54,55",	// Valid prefixes for this card type
			"checkdigit":true,				// True if a checkdigit is used to validate this card type
			"number":"5105105105105100",	// A trimmed and whitespaced-removed card number
			"valid":true					// If the number provided was valid (allows whitespace and dashes - use the returned number for a "clean" version of the card)
		}

	License: MIT http://www.opensource.org/licenses/mit-license.php
*/
;(function(context){
	var cardInfo = function(value) {
		//	Using cardTypes from http://developer.ean.com/general_info/Valid_Credit_Card_Types
		var cards = [
				{ cardType: "E", cardName: "VisaElectron", lengths: "16", prefixes: "417500,4917,4913,4508,4844", checkdigit: true },
				{ cardType: "S", cardName: "Switch", lengths: "16,18,19", prefixes: "4903,4905,4911,4936,564182,633110,6333,6759", checkdigit: true },
				{ cardType: "VI", cardName: "Visa", lengths: "13,16", prefixes: "4", checkdigit: true },
				{ cardType: "LC", cardName: "LaserCard", lengths: "16,17,18,19", prefixes: "6304,6706,6771,6709", checkdigit: true },
				{ cardType: "TO", cardName: "Maestro", lengths: "12,13,14,15,16,18,19", prefixes: "5018,5020,5038,6304,6759,6761", checkdigit: true },
				{ cardType: "CB", cardName: "CarteBlanche", lengths: "14", prefixes: "300,301,302,303,304,305", checkdigit: true },
				{ cardType: "CA", cardName: "MasterCard", lengths: "16", prefixes: "51,52,53,54,55", checkdigit: true },
				{ cardType: "DC", cardName: "DinersClub", lengths: "14,16", prefixes: "305,36,38,54,55", checkdigit: true },
				{ cardType: "AX", cardName: "AmEx", lengths: "15", prefixes: "34,37", checkdigit: true },
				{ cardType: "DS", cardName: "Discover", lengths: "16", prefixes: "6011,622,64,65", checkdigit: true },
				{ cardType: "JC", cardName: "JCB", lengths: "16", prefixes: "35", checkdigit: true },
				{ cardType: "ER", cardName: "enRoute", lengths: "15", prefixes: "2014,2149", checkdigit: true },
				{ cardType: "O", cardName: "Solo", lengths: "16,18,19", prefixes: "6334, 6767", checkdigit: true }
			],
			cardNo, cardexp, myCard, i, j, exp, tmp, checksum = 0, charsValid = false, checksumValid = false, lengthValid = false, prefixValid = false, prefix = [], lengths = [];

		cardNo = value.replace(/[\s-]/g, ""); // remove spaces and dashes
		cardexp = /^[0-9]{12,19}$/;
		// has chars or wrong length
		if (cardexp.exec(cardNo)) {
			charsValid = true;
		}

		// strip down to digits
		cardNo = cardNo.replace(/\D/g, "");

		//	Work out the card type, using the prefix
		for (i = 0; i < cards.length; i+=1) {
			prefix = cards[i].prefixes.split(",");
			for (j = 0; j < prefix.length; j+=1) {
				exp = new RegExp("^" + prefix[j]);
				if (exp.test(cardNo)) {
					myCard = cards[i];
					break;
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

		if (myCard.checkdigit) {
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
		}

		if(myCard.lengths) {
			lengths = myCard.lengths.split(",");
			for (j = 0; j < lengths.length; j++) {
				if (cardNo.length == lengths[j]) lengthValid = true;
			}
		}

		if(myCard.prefixes) {
			prefix = myCard.prefixes.split(",");
			for (i = 0; i < prefix.length; i++) {
				exp = new RegExp("^" + prefix[i]);
				if (exp.test(cardNo)) prefixValid = true;
			}
		}


		myCard.valid = !!(charsValid && checksumValid && prefixValid && lengthValid);

		return myCard? myCard: false;
	};

	context.cardInfo = cardInfo;

}(window));
