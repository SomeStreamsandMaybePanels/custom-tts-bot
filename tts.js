const { spawn } = require('child_process')
const readline = require('readline');
const ElevenLabs = require('elevenlabs-node')
const fs = require('fs')


const voice = new ElevenLabs({
    aipKey: "6bd14f4fb442ac700e618b7228ae7a56",
    voiceId: "8D6NuBEXZiqkGqkmGyn0"
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter livestream URL: ', (answer) => {
  const vBot = spawn('chat_downloader',[answer])
  vBot.stdout.on('data',(data)=> {
    const chat = data.toString()
    const match = chat.match(/!tts\s*(.*)/i);
if (match) {
  const extractedText = match[1];
  const voiceResponse = voice.textToSpeechStream({
    // Required Parameters
    textInput:       extractedText,                // The text you wish to convert to speech

    // Optional Parameters
    voiceId:         "8D6NuBEXZiqkGqkmGyn0",         // A different Voice ID from the default
    stability:       0.15,                            // The stability for the converted speech
    similarityBoost: 0.2,                            // The similarity boost for the converted speech
    modelId:         "eleven_multilingual_v2",       // The ElevenLabs Model ID
    style:           .8,                              // The style exaggeration for the converted speech
    responseType:    "stream",                       // The streaming type (arraybuffer, stream, json)
    speakerBoost:    true                            // The speaker boost for the converted speech
  }).then((res) => {
    res.pipe(fs.createWriteStream('output.wav'))
})
  console.log(`Extracted text: ${extractedText}`);
} else {
  console.log("No !tts command found.");
}    
    console.log(data)
})})

