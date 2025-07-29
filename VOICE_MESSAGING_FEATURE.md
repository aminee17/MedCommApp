# Voice Messaging Feature

## Overview
This feature enables users to record and send voice messages during chat conversations in the medical mobile app. Voice messages are stored as audio communications in the database with type `AUDIO`.

## Backend Implementation

### New Endpoints
- `POST /api/chat/send-voice` - Upload and send voice messages
- `GET /api/chat/audio/{messageId}` - Retrieve audio files for playback

### Database Changes
- Uses existing `Communication` table with `MessageType.AUDIO`
- Audio files stored in `audio-messages/` directory
- File path stored in `filePath` column

### Key Backend Files Modified
- `ChatController.java` - Added voice message endpoints
- `CommunicationService.java` - Added voice message handling logic
- `Communication.java` - Added missing consultation getter/setter

## Frontend Implementation

### New Components
- `VoiceRecorder.js` - Records and sends voice messages
- `VoicePlayer.js` - Plays voice messages with progress indicator

### Modified Chat Screens
- `Doctor/Chat.js` - Integrated voice messaging
- `Neurologue/Chat.js` - Integrated voice messaging

### Key Features
- Record voice messages using device microphone
- Visual recording indicator with cancel/send options
- Audio playback with progress bar and duration display
- Automatic message refresh after sending voice messages

## Dependencies
- Uses existing `expo-av` package for audio recording/playback
- No additional dependencies required

## File Storage
- Audio files stored in `audio-messages/` directory
- Unique filenames generated using UUID
- Supports common audio formats (.m4a, .mp3, etc.)

## Usage
1. In any chat conversation, tap the microphone icon to start recording
2. While recording, you can cancel or send the voice message
3. Voice messages appear as playable audio components in the chat
4. Tap play/pause to control audio playback

## Security Considerations
- Audio files are stored locally on the server
- Access controlled through existing authentication system
- File paths are not directly exposed to clients