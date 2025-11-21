import { ITool } from '../types';
import youtube from '../youtubeClient';

const compareChannelsTool: ITool = {
    name: 'compare_channels_stats',
    description: 'Accepts two channel IDs and retrieves key metrics (subscribers, total views, video count) for comparison.',

    inputSchema: {
        type: 'object',
        properties: {
            channelIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of channel IDs to compare (e.g., ["UC_x5XG1OV2P6uZZ5FSM9Ttw", "UC..."]).'
            }
        },
        required: ['channelIds'],
    },

    call: async (args: { channelIds: string[] }) => {
        try {
            const response = await youtube.channels.list({
                part: ['snippet', 'statistics'],
                id: args.channelIds,
            });

            const channels = response.data.items || [];

            const results = channels.map(channel => ({
                title: channel.snippet?.title,
                id: channel.id,
                subscribers: channel.statistics?.subscriberCount,
                totalViews: channel.statistics?.viewCount,
                videoCount: channel.statistics?.videoCount,
                description: channel.snippet?.description?.substring(0, 200) + '...',
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
                    text: `Channel Comparison Failed: ${error.message}`
                }],
                isError: true,
            };
        }
    },
};

export default compareChannelsTool;
