import { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface ITool {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
    };
    call: (args: any) => Promise<{
        content: { type: string; text: string }[];
        isError?: boolean;
    }>;
}
