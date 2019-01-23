const Alexa = require('alexa-sdk');
const striptags = require('striptags');
const corePath = './core/';
const APP_ID = '';
const get = require('lodash.get');
const repromptMessage = 'Welcome to the NodeJS API skill. You can say things like, what\'s the buffer?';
const helpMessage = 'You can say things like, tell me about cluster, or, what is the console?';
const unhandledMessage = 'I did not get that. You can say things like, Tel me about O. S. ?';

function getDefinition (method) {
  let definition = '';
  try {
    definition = striptags(require(corePath + method + '.json').modules[0].desc)
         .split(/([.!?])\s/)
         .filter(s => s.length > 1)
         .slice(0, 4)
         .join('. ');
  } catch (e) {}
  return definition;
}

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', repromptMessage, repromptMessage);
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', helpMessage, helpMessage);
  },
  'apiMethodDefinition': function () {
    const method = get(this, 'event.request.intent.slots.apimethod.value', '');
    if (!method.length) {
      this.emit(':tell', 'I could not get that');
      return;
    }
    const definition = getDefinition(method.toLowerCase());
    if (definition.length) {
      this.emit(':tell', 'A ' + method + ' is ' + definition);
      return;
    }
    this.emit(':tell', 'A definition for ' + method + ' could not be found');
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Good bye');
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Good bye');
  },
  'Unhandled': function () {
    this.emit(':ask', unhandledMessage, unhandledMessage);
  }
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
