require('dotenv').config()
const { spawn } = require('child_process')
const readline = require('readline')
const ElevenLabs = require('elevenlabs-node')
const fs = require('fs')


const voice = new ElevenLabs({
    apiKey: process.env.API_KEY,
    voiceId: process.env.VOICE_ID
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
    stability:       0.1,                            // The stability for the converted speech
    similarityBoost: 0.2,                            // The similarity boost for the converted speech
    modelId:         "eleven_multilingual_v2",       // The ElevenLabs Model ID
    style:           .8,                              // The style exaggeration for the converted speech
    responseType:    "stream",                       // The streaming type (arraybuffer, stream, json)
    speakerBoost:    true                            // The speaker boost for the converted speech
  }).then((res) => {
    res.pipe(fs.createWriteStream('output.wav'))
})
/*
  console.log(`Extracted text: ${extractedText}`)
  const speakerDevice = `@device_cm_{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave_{87E51327-714A-45BA-BDFE-381F886FFAB2}` // Adjust according to your system
  const virtualCableDevice = `@device_cm_{33D9A762-90C8-11D0-BD43-00A0C911CE86}\wave_{650D2203-F46B-4ED8-BFE6-D1D95770361E}`
  const ffmpeg = spawn('ffmpeg', [
    '-i', 'output.wav',
    '-filter_complex', `[0:a]asplit=2[a][b];[a]amerge[aout];[b]amerge[bout]`,
    '-map', '[aout]', '-f', 'wav', `pipe:1`,
    '-map', '[bout]', '-f', 'wav', `pipe:2`
  ])
  const speakerPlay = spawn('ffplay', ['-autoexit', '-nodisp', '-i', 'pipe:1']);
  const virtualCablePlay = spawn('ffplay', ['-autoexit', '-nodisp', '-i', 'pipe:2'])

  ffmpeg.on('close', (code) => {
    console.log(`ffplay process exited with code ${code}`);
    // Clean up the temporary file
    fs.unlink('output.wav', (err) => {
        if (err) console.error('Error deleting the temporary file:', err);
    });
});
*/
} else {
  console.log("No !tts command found.");
}    
    console.log(data)
})})

