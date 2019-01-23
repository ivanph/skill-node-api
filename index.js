const Alexa = require('alexa-sdk');
const striptags = require('striptags');
const corePath = './core/';
const APP_ID = '';
const get = require('lodash.get');

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
  'Unhandled': function () {
    this.emit(':tell', 'Welcome to the NodeJS API skill');
  }
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  if (typeof process.env.DEBUG === 'undefined') {
    alexa.APP_ID = '...';
  }
  alexa.registerHandlers(handlers);
  alexa.execute();
};
