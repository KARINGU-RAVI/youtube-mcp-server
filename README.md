# YouTube MCP Server

A Model Context Protocol (MCP) server that provides tools to interact with YouTube data, including searching videos, fetching transcripts, retrieving metadata, analyzing comments, and comparing channel statistics.

## Prerequisites

- Node.js (v16 or higher)
- A Google Cloud Project with **YouTube Data API v3** enabled.
- An API Key from the Google Cloud Console.

## Setup

1.  **Clone/Open the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    - Create a `.env` file in the root directory (if not already present).
    - Add your YouTube API Key:
      ```env
      YOUTUBE_API_KEY=your_actual_api_key_here
      ```

## Build

Compile the TypeScript code:

```bash
npm run build
```

## Running the Server

To run the server locally (stdio mode):

```bash
npm start
```

## Available Tools

-   **`search_youtube_videos`**: Search for videos by query.
    -   Args: `query` (string), `max_results` (number, optional)
-   **`get_video_transcript`**: Get raw transcript/captions for a video.
    -   Args: `videoId` (string), `language` (string, optional)
-   **`get_video_metadata`**: Get details like views, likes, tags, etc.
    -   Args: `videoId` (string)
-   **`analyze_video_comments`**: Get recent comments for analysis.
    -   Args: `videoId` (string), `max_results` (number, optional)
-   **`compare_channels_stats`**: Compare metrics of multiple channels.
    -   Args: `channelIds` (string[])

## Usage with MCP Client

Configure your MCP client (e.g., Claude Desktop, or an IDE extension) to point to this server.
Command: `node`
Args: `[path/to/project]/dist/index.js`
