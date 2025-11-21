#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import getTranscriptTool from './tools/getTranscript';
import getVideoMetadataTool from './tools/getVideoMetadata';
import searchVideosTool from './tools/search';
import analyzeCommentsTool from './tools/comments';
import compareChannelsTool from './tools/channel';
import { ITool } from './types';

// Define the tools list
const tools: ITool[] = [
    searchVideosTool,
    getTranscriptTool,
    getVideoMetadataTool,
    analyzeCommentsTool,
    compareChannelsTool,
];

// Create the server instance
const server = new Server(
    {
        name: 'youtube-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Handle ListToolsRequest
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
        })),
    };
});

// Handle CallToolRequest
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);

    if (!tool) {
        throw new Error(`Tool not found: ${request.params.name}`);
    }

    // Execute the tool's call function
    // We cast the arguments to any because we've validated the tool existence
    // In a production app, you might want stricter validation against the schema
    return await tool.call(request.params.arguments);
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('YouTube MCP Server running on stdio');

    // CRITICAL FIX: Keep the process alive indefinitely for Render
    await new Promise(() => {
        // This promise never resolves, keeping the Node.js event loop alive
    });
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
