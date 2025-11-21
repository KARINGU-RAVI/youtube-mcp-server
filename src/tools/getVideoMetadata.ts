import { ITool } from '../types';
import youtube from '../youtubeClient';

const getVideoMetadataTool: ITool = {
    name: 'get_video_metadata',
    description: 'Fetches essential statistics and metadata (views, likes, description, tags, channel name) for a single video ID.',

    inputSchema: {
        type: 'object',
        properties: {
            videoId: {
                type: 'string',
                description: 'The unique 11-character YouTube video ID.'
            }
        },
        required: ['videoId'],
    },

    call: async (args: { videoId: string }) => {
        try {
            const response = await youtube.videos.list({
                part: ['snippet', 'statistics'],
                id: [args.videoId],
            });

            const video = response.data.items?.[0];

            if (!video) {
                throw new Error('Video not found or is private.');
            }

            // Extract and clean up the data for the LLM
            const formattedData = {
                title: video.snippet?.title,
                channelTitle: video.snippet?.channelTitle,
                views: video.statistics?.viewCount,
                likes: video.statistics?.likeCount,
                descriptionSnippet: video.snippet?.description?.substring(0, 200) + '...', // Limit description size
                tags: video.snippet?.tags,
                publishedAt: video.snippet?.publishedAt,
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(formattedData, null, 2)
                }],
            };

        } catch (error: any) {
            return {
                content: [{
                    type: 'text',
                    text: `Metadata Retrieval Failed: ${error.message}`
                }],
                isError: true,
            };
        }
    },
};

export default getVideoMetadataTool;
