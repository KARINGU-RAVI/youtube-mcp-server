import { ITool } from '../types';
import { YoutubeTranscript } from 'youtube-transcript';

// Example logic for fetching the transcript text
async function fetchYouTubeTranscript(videoId: string, language: string = 'en'): Promise<string> {
    try {
        const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId, { lang: language });
        return transcriptArray.map((t: { text: string }) => t.text).join(' ');
    } catch (e: any) {
        console.error("Error fetching transcript:", e);
        throw new Error("Transcript not available or invalid video ID.");
    }
}

const getTranscriptTool: ITool = {
    name: 'get_video_transcript',
    description: 'Retrieves the complete, raw text transcript or captions for a given YouTube video ID. Useful for summarization, topic modeling, or detailed content analysis.',

    inputSchema: {
        type: 'object',
        properties: {
            videoId: {
                type: 'string',
                description: 'The unique 11-character identifier for the YouTube video (e.g., "dQw4w9WgXcQ").'
            },
            language: {
                type: 'string',
                description: 'The two-letter language code for the desired transcript (e.g., "en", "es"). Defaults to "en".',
                default: 'en'
            }
        },
        required: ['videoId'],
    },

    call: async (args: { videoId: string, language?: string }) => {
        try {
            const transcriptText = await fetchYouTubeTranscript(args.videoId, args.language);

            // The MCP server always returns the result in a structured 'content' array
            return {
                content: [{
                    type: 'text',
                    text: transcriptText
                }],
                isError: false,
            };

        } catch (error: any) {
            return {
                content: [{
                    type: 'text',
                    text: `Transcript Retrieval Failed: ${error.message}`
                }],
                isError: true, // Crucial to signal a tool execution error to the LLM
            };
        }
    },
};

export default getTranscriptTool;
