import { ITool } from '../types';
import youtube from '../youtubeClient';

const searchVideosTool: ITool = {
    name: 'search_youtube_videos',
    description: 'Searches YouTube for videos based on a query, returning a list of titles, URLs, and channel names.',

    inputSchema: {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'The search query (e.g., "Model Context Protocol tutorial").'
            },
            max_results: {
                type: 'number',
                description: 'Maximum number of results to return (default 5).',
                default: 5
            }
        },
        required: ['query'],
    },

    call: async (args: { query: string, max_results?: number }) => {
        try {
            const response = await youtube.search.list({
                part: ['snippet'],
                q: args.query,
                maxResults: args.max_results || 5,
                type: ['video'],
            });

            const videos = response.data.items || [];

            const results = videos.map(video => ({
                title: video.snippet?.title,
                channelTitle: video.snippet?.channelTitle,
                videoId: video.id?.videoId,
                url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
                description: video.snippet?.description,
            }));

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(results, null, 2)
                }],
                isError: false,
            };

        } catch (error: any) {
            return {
                content: [{
                    type: 'text',
                    text: `Search Failed: ${error.message}`
                }],
                isError: true,
            };
        }
    },
};

export default searchVideosTool;
