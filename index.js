// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
let p1="";
let p2="";
let solution;
let p1score=0;
let p2score=0;
let z=0;
let round=0;
let first = true;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        //Welcome message
        const speakOutput = 'Welcome to Take a Shot. Currently it is a two player game. Do you have someone to play with?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CountIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CountIntent';
    },
    handle(handlerInput) {
        //Two players confirmed
        const answer = handlerInput.requestEnvelope.request.intent.slots.ans.value;
        let speakOutput;
        if (answer === "yes") {
            if (first)
                speakOutput = 'What are your good names?';
            else
                speakOutput = "What are your good names again?";
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        else  {
            if (first)
                //Two player condition not satisfied
                speakOutput = "Sorry! Why don't you get one of your friends so that we can play later";
            else 
                speakOutput = "It was fun playing with you guys. Come back again later. Have a nice day. "+'<audio src="soundbank://soundlibrary/toys_games/toys/toys_15"/>';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    }
};

var color = ["black", "brown", "white"];
//Array of Questions and Answers to be extended further
var myArray = [
{
    "name":"cat",
    "src":"soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01",
    "kquestions":[
                {"question":"Is cat a wild animal or a domestic animal","answer":"domestic"},
                {"question":"Does cat have whiskers?","answer":"yes"},
                {"question":"How would you describe cats? Are they tall, tiny or something else?", "answer":"small"},
                {"question":"What is a male cat called?","answer":"Tom"},
                {"question":"What is a female cat called?","answer":"Molly"},
                {"question":"What is a cat child called?","answer":"kitten"}
                 ],
    "gquestions":[
                {"question":"What color do you think is it?", "answer":color[getRandomInt(2)]},
                {"question":"How many months old do you think is it?","answer":getRandomInt(40)}]
},
{
    "name":"elephant",
    "src":"soundbank://soundlibrary/animals/amzn_sfx_elephant_01",
    "kquestions":[
                {"question":"What is a group of elephants called?","answer":"herd"},
                {"question":"An elephant's trunk is similar to what human body part","answer":"nose"},
                {"question":"Does elephant eat meat?", "answer":"no"},
                {"question":"What is elephant's child called?","answer":"calf"}
                 ],
    "gquestions":[
                {"question":"What color do you think is it?", "answer":color[getRandomInt(1)]},
                {"question":"What is it's height in foot?","answer":getRandomInt(13)}] //between 9 and 13
    
}
];

var no=Math.floor(Math.random() * Math.floor(myArray.length));
// var no=0;
var source=myArray[no].src
var name=myArray[no].name
var kquestions=myArray[no].kquestions
var gquestions=myArray[no].gquestions

//____________________________________________________________________
//Tells the rules, plays the animal sound and asks for the animal name
const GetNamesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNamesIntent';
    },
    handle(handlerInput) {
        p1 = handlerInput.requestEnvelope.request.intent.slots.fname.value;
        p2 = handlerInput.requestEnvelope.request.intent.slots.sname.value;
        let speakOutput="";
        if (first)
            speakOutput+='Love your names, '+p1+" and "+p2+". The rules are simple. You hear the voice and answer the questions that follow. There is one simple general knowledge question for each and one fun question where you have to make a guess. ";
        const speakOutput1 = ' Listen carefully. <audio src="'+source+'"/> <audio src="'+source+'"/> Which animal did it sound like?';
        
        return handlerInput.responseBuilder
            .speak(speakOutput+speakOutput1)
            .reprompt('Take a Shot')
            .getResponse();
    }
};

//Random 1st question and answer
var freddie=Math.floor(Math.random() * Math.floor(kquestions.length));
var selq=kquestions[freddie].question
var sela=kquestions[freddie].answer
//___________________________________________________________________________________________FIRST ROUND
//Verifies the animal's name, and asks player 1 the first question
const GetAnimalIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetAnimalIntent';
    },
    handle(handlerInput) {
        const ans = handlerInput.requestEnvelope.request.intent.slots.animal.value;
        let speakOutput;
        if (ans === name) {
            speakOutput = '<audio src="soundbank://soundlibrary/musical/amzn_sfx_drum_and_cymbal_02"/> You guys are amazing! '+name+" it is. Let's see how much you know about the "+name+". Remember to use 'my answer is' followed by answer. Starting with "+p1+". ";
            return handlerInput.responseBuilder
                .speak(speakOutput+selq)
                .reprompt("Take a shot, you are probably right.")
                .getResponse();
        }
        else  {
            speakOutput = "Oops! It is a "+name+". That's okay. Let's start the game. "+p1+", it's your turn. ";
            return handlerInput.responseBuilder
                .speak(speakOutput+selq)
                .reprompt("C'mon, you know it!")
                .getResponse();
        }
    }
};
//_____________________________________________________________________________________________________SECOND ROUND
//Getting both their answers for the first question and computing their scores, and asking the 2nd question
let p1ans, p2ans; let winner="";
const GetAnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetAnswerIntent';
    },
    handle(handlerInput) {
        switch (round) {
            case 0:
                if (z===0) {
                    p1ans = handlerInput.requestEnvelope.request.intent.slots.answer.value;
                    if (p1ans===sela) {
                        p1score+=1;
                        winner = p1;
                    }
                    let speakOutput="The correct answer is "+sela+". ";
                    if (winner===p1) speakOutput+="Good work, "+p1+". "+'<audio src="soundbank://soundlibrary/musical/amzn_sfx_drum_and_cymbal_01"/>';
                    else speakOutput+='<audio src="soundbank://soundlibrary/musical/amzn_sfx_drum_comedy_03"/>'
                    freddie=Math.floor(Math.random() * Math.floor(kquestions.length));
                    selq=kquestions[freddie].question
                    sela=kquestions[freddie].answer
                    speakOutput+=" "+p2+", your question is "+selq;
                    z=1;
                    return handlerInput.responseBuilder
                            .speak(speakOutput)
                            .reprompt("C'mon, you know it!")
                            .getResponse();
                }
                else {
                    p2ans = handlerInput.requestEnvelope.request.intent.slots.answer.value;
                    z=0;
                    if (p2ans===sela) {
                        p2score+=1;
                        winner = p2;
                    }
                    let speakOutput="The correct answer is "+sela+". ";
                    if (winner===p2) speakOutput+="Good work, "+p2+". "+'<audio src="soundbank://soundlibrary/musical/amzn_sfx_drum_and_cymbal_01"/>';
                    else speakOutput+='<audio src="soundbank://soundlibrary/musical/amzn_sfx_drum_comedy_03"/>';
                    speakOutput+="Next question for "+p2+". "+gquestions[0].question;
                    round+=1;
                    return handlerInput.responseBuilder
                            .speak(speakOutput)
                            .reprompt("C'mon, you know it!")
                            .getResponse();
                }
            case 1:
                let kela = gquestions[0].answer
                if (z===0) {
                    p2ans = handlerInput.requestEnvelope.request.intent.slots.ganss.value;
                    if (p2ans===kela) {
                        p2score+=1;
                        winner = p2;
                    }
                    let speakOutput=p1+", what is your answer?"
                    z=1;
                    return handlerInput.responseBuilder
                            .speak(speakOutput)
                            .reprompt("C'mon, you know it!")
                            .getResponse();
                }
                else {
                    p1ans = handlerInput.requestEnvelope.request.intent.slots.ganss.value;
                    z=0;
                    if (p1ans===kela) {
                        p1score+=1;
                        if (winner === p2) winner = "both";
                        else winner = p1;
                    }
                    let speakOutput="The correct answer is "+kela+". ";
                    if (winner===p1) speakOutput+="Great guess, "+p1+". ";
                    else if (winner===p2) speakOutput+="Great guess, "+p2+". ";
                    else speakOutput+="Great work guys. ";
            //         speakOutput+="Next question for "+p1+". "+gquestions[1].question;
            //         round+=1;
            //         return handlerInput.responseBuilder
            //                 .speak(speakOutput)
            //                 .reprompt("C'mon, you know it!")
            //                 .getResponse();
            //     }
            //   case 2:
            //     kela = gquestions[1].answer;
            //     if (z===0) {
            //         p1ans = handlerInput.requestEnvelope.request.intent.slots.gans.value;
            //         if (p1ans===kela) {
            //             p1score+=1;
            //             winner = p1;
            //         }
            //         let speakOutput=p2+", what is your answer?"
            //         z=1;
            //         return handlerInput.responseBuilder
            //                 .speak(speakOutput)
            //                 .reprompt("C'mon, you know it!")
            //                 .getResponse();
            //     }
            //     else {
            //         p2ans = handlerInput.requestEnvelope.request.intent.slots.gans.value;
            //         z=0;
            //         if (p2ans===kela) {
            //             p2score+=1;
            //             if (winner === p1) winner = "both";
            //             else winner = p2;
            //         }
            //         let speakOutput="The correct answer is "+kela+". ";
            //         if (winner===p1) speakOutput+="Superb, "+p1+". ";
            //         else if (winner===p2) speakOutput+="Superb, "+p2+". ";
            //         else speakOutput+="Great work guys. "+p1+". ";
                    if (p1score>p2score)
                        speakOutput+='We have a winner. <audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_03"/> and the winner is <audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_04"/> '+p1+". ";
                    else if (p2score>p1score)
                        speakOutput+='We have a winner. <audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_03"/> and the winner is <audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_04"/> '+p2+". " ;
                    else
                        speakOutput+='<audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_03"/><audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_04"/>You guys scored equally, it is a draw. ';
                    first = false;
                    speakOutput+="Do you want to play again?"
                    return handlerInput.responseBuilder
                            .speak(speakOutput)
                            .reprompt("C'mon, you know it!")
                            .getResponse();
                } 
                
        }
    }
    
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CountIntentHandler,
        GetNamesIntentHandler,
        GetAnimalIntentHandler,
        GetAnswerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
