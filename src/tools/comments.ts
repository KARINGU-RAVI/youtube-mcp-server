import { ITool } from '../types';
import youtube from '../youtubeClient';

const analyzeCommentsTool: ITool = {
    name: 'analyze_video_comments',
    description: 'Retrieves recent comments from a video. The actual analysis (sentiment, topics) is performed by the LLM using the returned comments.',

    inputSchema: {
        type: 'object',
        properties: {
            videoId: {
                type: 'string',
                description: 'The unique 11-character YouTube video ID.'
            },
            max_results: {
                type: 'number',
                description: 'Maximum number of comments to retrieve (default 20).',
                default: 20
            }
        },
        required: ['videoId'],
    },

    call: async (args: { videoId: string, max_results?: number }) => {
        try {
            const response = await youtube.commentThreads.list({
                part: ['snippet'],
                videoId: args.videoId,
                maxResults: args.max_results || 20,
                textFormat: 'plainText',
            });

            const comments = response.data.items || [];

            const extractedComments = comments.map(comment => ({
                author: comment.snippet?.topLevelComment?.snippet?.authorDisplayName,
                text: comment.snippet?.topLevelComment?.snippet?.textDisplay,
                likes: comment.snippet?.topLevelComment?.snippet?.likeCount,
                publishedAt: comment.snippet?.topLevelComment?.snippet?.publishedAt,
            }));

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(extractedComments, null, 2)
                }],
            isError: false,
            };

        } catch (error: any) {
            return {
                content: [{
                    type: 'text',
                    text: `Comment Retrieval Failed: ${error.message}`
                }],
                isError: true,
            };
        }
    },
};

export default analyzeCommentsTool;
