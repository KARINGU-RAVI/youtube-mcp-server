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
import * as http from 'http';

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

    // Start a minimal HTTP health-check server so platforms like Render
    // detect the service as running (listens on process.env.PORT or 8080).
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
    const healthServer = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
            return;
        }
        res.writeHead(404);
        res.end();
    });

    healthServer.listen(port, () => {
        console.error(`Health server listening on port ${port}`);
    });

    // Keep the process alive for Render and other hosts. The HTTP server
    // will keep the event loop active; still await a never-resolving promise
    // to ensure the process doesn't exit even if no other handles are present.
    await new Promise(() => {
        // intentionally never resolves
    });
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
