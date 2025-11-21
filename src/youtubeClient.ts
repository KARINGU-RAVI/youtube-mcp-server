
import { google } from 'googleapis';

const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
    console.warn('Warning: YOUTUBE_API_KEY is not set in .env file.');
}

const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

export default youtube;
