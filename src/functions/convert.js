const { app } = require('@azure/functions');
const { ElevenLabsClient } = require('elevenlabs'); // Adjust import based on actual package

app.http('convert', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const text = request.query.get("message") || 'Hello, What do you want me to translate?';
        const voiceName = request.query.get("voice") || "Sarah"
        const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY; // Use environment variables for sensitive data
        // const ELEVEN_LABS_VOICE_ID = "NNMFqkv6PLvHLAz0p8ur";

        const voice = voices.find(voice => voice.name === voiceName)

        try {
            // Generate audio from text
            const client = new ElevenLabsClient({
                apiKey: ELEVEN_LABS_API_KEY,
            });

            const createAudioStreamFromText = async (text) => {
                const audioStream = await client.generate({
                    voice: voice.voice_id,
                    model_id: "eleven_turbo_v2",
                    text,
                });

                const chunks = [];
                for await (const chunk of audioStream) {
                    chunks.push(chunk);
                }

                return Buffer.concat(chunks);
            };


            const audioBuffer = await createAudioStreamFromText(text);

            // Return audio data in the HTTP response
            return {
                status: 200,
                headers: {
                    'Content-Type': 'audio/mpeg', // Adjust according to the actual audio format
                },
                body: audioBuffer,
            };
        } catch (error) {
            return {
                status: 500,
                body: 'Error processing the request.',
            };
        }
    }
});


const voices = [
    {
        "name": "Sarah",
        "voice_id": "EXAVITQu4vr4xnSDxMaL"
    },
    {
        "name": "Laura",
        "voice_id": "FGY2WhTYpPnrIDTdsKH5"
    },
    {
        "name": "Charlie",
        "voice_id": "IKne3meq5aSn9XLyUdCD"
    },
    {
        "name": "George",
        "voice_id": "JBFqnCBsd6RMkjVDRZzb"
    },
    {
        "name": "Callum",
        "voice_id": "N2lVS1w4EtoT3dr4eOWO"
    },
    {
        "name": "Liam",
        "voice_id": "TX3LPaxmHKxFdv7VOQHJ"
    },
    {
        "name": "Charlotte",
        "voice_id": "XB0fDUnXU5powFXDhCwa"
    },
    {
        "name": "Alice",
        "voice_id": "Xb7hH8MSUJpSbSDYk0k2"
    },
    {
        "name": "Matilda",
        "voice_id": "XrExE9yKIg1WjnnlVkGX"
    },
    {
        "name": "Lily",
        "voice_id": "pFZP5JQG7iQjIQuC4Bku"
    }
]
