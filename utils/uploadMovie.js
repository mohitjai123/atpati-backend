const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

ffmpeg.setFfmpegPath("C:/ffmpeg/ffmpeg.exe");

const uploadFile = async (wss, videoPath) => {
    const outputFolder = `qualities-${Date.now()}`;
    const outputDir = path.join(__dirname, "..", 'output', outputFolder); // HLS output directory

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const resolutions = [
        { resolution: '256x144', bitrate: '400k' },
        { resolution: '426x240', bitrate: '800k' },
        { resolution: '640x360', bitrate: '1500k' },
        { resolution: '1280x720', bitrate: '3000k' },
        { resolution: '1920x1080', bitrate: '5000k' }
    ];

    const outputFiles = [];
    let completedCount = 0;

    // Create a list of promises for all resolutions
    const conversionPromises = resolutions.map((res) => {
        const resDir = path.join(outputDir, `${res.resolution}`);
        if (!fs.existsSync(resDir)) {
            fs.mkdirSync(resDir, { recursive: true });
        }

        // Return a Promise for each FFmpeg command
        return new Promise((resolve, reject) => {
            const command = ffmpeg(videoPath)
                .outputOptions([
                    `-s ${res.resolution}`,    // Set resolution
                    `-b:v ${res.bitrate}`,     // Set bitrate
                    '-hls_time 10',            // Segment length (10 seconds)
                    '-hls_list_size 0',        // Include all segments in playlist
                    '-f hls',                  // Output format
                    '-hls_segment_filename', path.join(resDir, 'segment_%03d.ts') // Segment naming convention
                ])
                .output(path.join(resDir, 'my_video.m3u8')); // The m3u8 file for each resolution

            outputFiles.push(path.join(resDir, 'my_video.m3u8'));

            command.on('progress', (progress) => {
                const percentage = Math.round(progress.percent);
                console.log(`${res.resolution} progress: ${percentage}%`);

                // Broadcast progress to all connected WebSocket clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            resolution: res.resolution,
                            progress: percentage
                        }));
                    }
                });
            });

            command.on('end', () => {
                completedCount++;
                console.log(`${res.resolution} HLS stream generation complete.`);

                // Broadcast completion message for each resolution
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            resolution: res.resolution,
                            status: 'completed',
                            completedCount,
                            totalResolutions: resolutions.length
                        }));
                    }
                });

                resolve(); // Resolve the promise when the task is complete
            });

            command.on('error', (err) => {
                console.error('Error:', err);
                reject(err); // Reject the promise if there's an error
            });

            command.run();
        });
    });

    // Wait for all FFmpeg tasks to complete
    try {
        await Promise.all(conversionPromises); // Wait for all conversions to finish
        console.log('All conversions are complete.');

        // Generate the master playlist after all conversions are done
        const masterPlaylistPath = path.join(outputDir, 'master.m3u8');
        const masterPlaylist = resolutions.map((res) => {
            return `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bitrate) * 1000},RESOLUTION=${res.resolution}\n${res.resolution}/my_video.m3u8`;
        }).join('\n');

        // Write the master playlist to the output directory
        fs.writeFileSync(masterPlaylistPath, `#EXTM3U\n${masterPlaylist}`);
        console.log('Master playlist created:', masterPlaylistPath);

        return `output/${outputFolder}/master.m3u8`;
    } catch (error) {
        console.error('Error during conversion:', error);
        throw error;
    }
};

module.exports = { uploadFile };
