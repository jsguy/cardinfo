cardinfo
========

Get information about a credit card number

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
