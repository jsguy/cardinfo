/*
	Advanced credit card validator

	This script uses cardInfo.js:

		https://github.com/jsguy/cardinfo/

	To create an advanced credit card validator for the jQuery Validation plugin:

		http://jqueryvalidation.org/

	Why?

	If you have a look at the credit card validator that is included:

		http://jqueryvalidation.org/creditcard-method/

	You will see that it will redily accept values such as "41111", which 
	passes luhn validation, but is not a valid credit card. This plugin 
    attempts to address this by checking more details, such as 
	the length and starting digits of the card, plus card type.

	License: MIT http://www.opensource.org/licenses/mit-license.php

	Usage:

	param is an optional object with the following attributes:

	cardtype - 	a function to return the card type, see the "cards" variable below for valid card types. 
				Use this function to enforce checking when the user has chosen a credit card type.
                Note: the funciton is passed the card info object.
*/
if (jQuery && jQuery.validator) {
    //	Add our validator if we can
    jQuery.validator.addMethod("creditcardadvanced", function (value, element, param) {
        //	Grab the card information
        var card = cardInfo(value),
            //  See if we have a function, or need to use eval if it's a string.
            cardTypeFunc = $.isFunction(window[param.cardtype])?
                window[param.cardtype]: 
                eval("(" + param.cardtype + ")");

        //	Check if we have a card type function for comparing the card type
        if (jQuery.isFunction(cardTypeFunc)) {
            if (card.cardCode !== cardTypeFunc(card)) {
                return false;
            }
        }

        return card.valid;
        //	Reuse the standard CC validation message
    }, jQuery.validator.messages.creditcard);

    //	Add an unobtrusive adapter if we can
    if (jQuery.validator.unobtrusive && jQuery.validator.unobtrusive.adapters) {
        jQuery.validator.unobtrusive.adapters.add('creditcardadvanced', ['cardtype'], function (options) {
            options.rules['creditcardadvanced'] = options.params;
            if (options.message) {
                options.messages['creditcardadvanced'] = options.message;
            }
        });
    }
}
