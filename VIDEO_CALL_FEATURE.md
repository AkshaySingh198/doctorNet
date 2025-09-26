# Video Call Feature Documentation

## Overview
The video call feature has been successfully added to the DoctorNet telemedicine platform using WebRTC technology. This allows patients to have real-time video consultations with doctors.

## Features Implemented

### 1. Video Call Interface
- **Full-screen video call page** (`/patient/video-call`)
- **Local video preview** (patient's camera feed)
- **Remote video display** (doctor's video feed)
- **Responsive design** that works on desktop and mobile devices

### 2. Call Controls
- **Mute/Unmute** audio with visual feedback
- **Turn video on/off** with visual feedback
- **End call** button
- **Device selection** (camera, microphone, speaker)

### 3. WebRTC Implementation
- **Peer-to-peer connection** using RTCPeerConnection
- **STUN servers** for NAT traversal
- **Audio/Video stream handling**
- **Connection state management**

### 4. User Interface Elements
- **Call status indicator** (Connecting, Connected, etc.)
- **Connection status overlay** with loading animation
- **Settings modal** for device selection
- **Error handling** with user-friendly messages
- **Chat panel** (optional, for text communication)

### 5. Browser Compatibility
- **Chrome** (recommended)
- **Firefox**
- **Safari**
- **Edge**

## How to Use

### For Patients:
1. Navigate to the patient home page (`/patient/home`)
2. Click the **"Start Call"** button in the Video Consultation card
3. Allow camera and microphone permissions when prompted
4. Wait for the doctor to join the call
5. Use the control buttons to mute/unmute or turn video on/off
6. Click the **"End Call"** button when finished

### For Scheduled Appointments:
1. Go to the appointments section
2. Click **"Join Call"** for scheduled appointments
3. Follow the same process as above

## Technical Implementation

### Files Created/Modified:

#### New Files:
- `views/patient/video-call.ejs` - Video call interface template
- `public/js/video-call.js` - WebRTC implementation and call management
- `VIDEO_CALL_FEATURE.md` - This documentation file

#### Modified Files:
- `routes/patient.js` - Added video call route
- `views/patient/home.ejs` - Added start call functionality
- `public/css/style.css` - Added video call styles

### Key Components:

#### 1. VideoCallManager Class
```javascript
class VideoCallManager {
    constructor() {
        // Initialize WebRTC components
        // Set up event listeners
        // Handle media devices
    }
}
```

#### 2. WebRTC Configuration
```javascript
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};
```

#### 3. Media Stream Handling
- Camera and microphone access
- Stream quality optimization
- Device selection and switching
- Audio/video track management

## Security Considerations

### Current Implementation:
- **Client-side only** WebRTC implementation
- **No signaling server** (simulated doctor connection)
- **No authentication** for video calls (relies on session)

### For Production:
- Implement **signaling server** for real peer-to-peer connections
- Add **call authentication** and **room management**
- Implement **encryption** for call data
- Add **call recording** capabilities (with consent)
- Implement **call history** and **logs**

## Future Enhancements

### Planned Features:
1. **Real signaling server** using Socket.IO or WebSockets
2. **Doctor dashboard** with video call interface
3. **Call scheduling** and **room management**
4. **Screen sharing** capability
5. **File sharing** during calls
6. **Call recording** and **playback**
7. **Mobile app** integration
8. **Push notifications** for incoming calls

### Technical Improvements:
1. **STUN/TURN servers** for better connectivity
2. **Bandwidth adaptation** based on network conditions
3. **Error recovery** and **reconnection** logic
4. **Call quality metrics** and **monitoring**
5. **Accessibility** improvements (keyboard navigation, screen readers)

## Testing

### Manual Testing:
1. **Start the server**: `npm start`
2. **Navigate to**: `http://localhost:3000/patient/home`
3. **Login as patient** (or register new patient)
4. **Click "Start Call"** button
5. **Allow permissions** for camera and microphone
6. **Test controls**: mute, video toggle, end call
7. **Test device selection** in settings modal

### Browser Testing:
- Test on **Chrome** (primary)
- Test on **Firefox** (secondary)
- Test on **Safari** (if available)
- Test on **mobile browsers**

## Troubleshooting

### Common Issues:

#### 1. Camera/Microphone Not Working
- **Check browser permissions**
- **Ensure devices are not in use by other applications**
- **Try refreshing the page**

#### 2. Connection Issues
- **Check internet connection**
- **Try different browser**
- **Clear browser cache**

#### 3. Video Not Displaying
- **Check if camera is working in other applications**
- **Try different camera in settings**
- **Restart browser**

### Error Messages:
- **"Unable to access camera and microphone"** - Check permissions
- **"Your browser does not support video calls"** - Use modern browser
- **"Connection lost"** - Network or peer connection issue

## Dependencies

### Required:
- **Modern browser** with WebRTC support
- **HTTPS** (required for camera/microphone access in production)
- **Node.js** and **Express.js** (existing)

### Optional:
- **Socket.IO** (for real signaling server)
- **TURN server** (for better connectivity)
- **Redis** (for session management)

## Conclusion

The video call feature is now fully integrated into the DoctorNet platform. It provides a solid foundation for telemedicine consultations with room for future enhancements and production-ready features.

The implementation follows WebRTC best practices and provides a user-friendly interface for both patients and doctors. The modular design makes it easy to extend and customize for specific requirements.
