// WebRTC Video Call Implementation
class VideoCallManager {
    constructor() {
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.isMuted = false;
        this.isVideoOff = false;
        this.isCallActive = false;
        
        // WebRTC Configuration
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ]
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCall();
    }
    
    initializeElements() {
        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remoteVideo');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.callStatus = document.getElementById('callStatus');
        
        // Control buttons
        this.muteBtn = document.getElementById('muteBtn');
        this.videoBtn = document.getElementById('videoBtn');
        this.hangupBtn = document.getElementById('hangupBtn');
        this.toggleMute = document.getElementById('toggleMute');
        this.toggleVideo = document.getElementById('toggleVideo');
        this.endCall = document.getElementById('endCall');
        
        // Chat elements
        this.chatPanel = document.getElementById('chatPanel');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendMessage = document.getElementById('sendMessage');
        
        // Settings elements
        this.cameraSelect = document.getElementById('cameraSelect');
        this.microphoneSelect = document.getElementById('microphoneSelect');
        this.speakerSelect = document.getElementById('speakerSelect');
    }
    
    setupEventListeners() {
        // Control buttons
        this.muteBtn.addEventListener('click', () => this.toggleMuteAudio());
        this.videoBtn.addEventListener('click', () => this.toggleVideoStream());
        this.hangupBtn.addEventListener('click', () => this.endCallSession());
        
        // Header buttons
        this.toggleMute.addEventListener('click', () => this.toggleMuteAudio());
        this.toggleVideo.addEventListener('click', () => this.toggleVideoStream());
        this.endCall.addEventListener('click', () => this.endCallSession());
        
        // Chat
        this.sendMessage.addEventListener('click', () => this.sendChatMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
        
        // Settings
        document.getElementById('applySettings').addEventListener('click', () => this.applySettings());
        
        // Window events
        window.addEventListener('beforeunload', () => this.endCall());
        window.addEventListener('unload', () => this.endCall());
    }
    
    async initializeCall() {
        try {
            this.showConnectionStatus('Requesting camera and microphone access...');
            
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            // Set local video source
            this.localVideo.srcObject = this.localStream;
            
            // Populate device selectors
            await this.populateDeviceSelectors();
            
            // Initialize peer connection
            this.initializePeerConnection();
            
            // Simulate connection to doctor (in real app, this would be through signaling server)
            this.simulateDoctorConnection();
            
        } catch (error) {
            console.error('Error accessing media devices:', error);
            this.showError('Unable to access camera and microphone. Please check your permissions.');
        }
    }
    
    async populateDeviceSelectors() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            // Clear existing options
            this.cameraSelect.innerHTML = '<option value="">Select Camera</option>';
            this.microphoneSelect.innerHTML = '<option value="">Select Microphone</option>';
            this.speakerSelect.innerHTML = '<option value="">Select Speaker</option>';
            
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `${device.kind} ${device.deviceId.substring(0, 8)}`;
                
                if (device.kind === 'videoinput') {
                    this.cameraSelect.appendChild(option);
                } else if (device.kind === 'audioinput') {
                    this.microphoneSelect.appendChild(option);
                } else if (device.kind === 'audiooutput') {
                    this.speakerSelect.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error enumerating devices:', error);
        }
    }
    
    initializePeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.configuration);
        
        // Add local stream to peer connection
        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });
        
        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            this.remoteVideo.srcObject = this.remoteStream;
            this.hideConnectionStatus();
            this.updateCallStatus('Connected');
        };
        
        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // In a real app, send this to the other peer via signaling server
                console.log('ICE candidate:', event.candidate);
            }
        };
        
        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection.connectionState);
            switch (this.peerConnection.connectionState) {
                case 'connected':
                    this.updateCallStatus('Connected');
                    this.hideConnectionStatus();
                    break;
                case 'disconnected':
                case 'failed':
                    this.updateCallStatus('Connection Lost');
                    this.showError('Connection lost. Please try again.');
                    break;
                case 'closed':
                    this.updateCallStatus('Call Ended');
                    break;
            }
        };
    }
    
    simulateDoctorConnection() {
        // Simulate doctor joining the call after 3 seconds
        setTimeout(() => {
            this.updateCallStatus('Doctor joined the call');
            this.hideConnectionStatus();
            this.isCallActive = true;
            
            // Simulate receiving remote video (in real app, this would come from signaling)
            this.simulateRemoteVideo();
        }, 3000);
    }
    
    simulateRemoteVideo() {
        // Create a simple test pattern for remote video
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        
        const drawTestPattern = () => {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#3498db';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Doctor Video Feed', canvas.width / 2, canvas.height / 2);
            ctx.fillText('(Simulated)', canvas.width / 2, canvas.height / 2 + 30);
            
            // Create a simple animation
            const time = Date.now() / 1000;
            ctx.fillStyle = `hsl(${(time * 50) % 360}, 70%, 50%)`;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2 + 60, 20 + Math.sin(time) * 10, 0, 2 * Math.PI);
            ctx.fill();
        };
        
        const animate = () => {
            drawTestPattern();
            requestAnimationFrame(animate);
        };
        animate();
        
        // Convert canvas to stream
        const stream = canvas.captureStream(30);
        this.remoteVideo.srcObject = stream;
    }
    
    toggleMuteAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                this.isMuted = !audioTrack.enabled;
                
                // Update UI
                const icon = this.muteBtn.querySelector('i');
                const headerIcon = this.toggleMute.querySelector('i');
                
                if (this.isMuted) {
                    icon.className = 'fas fa-microphone-slash';
                    headerIcon.className = 'fas fa-microphone-slash';
                    this.muteBtn.classList.add('btn-danger');
                    this.muteBtn.classList.remove('btn-outline-light');
                } else {
                    icon.className = 'fas fa-microphone';
                    headerIcon.className = 'fas fa-microphone';
                    this.muteBtn.classList.remove('btn-danger');
                    this.muteBtn.classList.add('btn-outline-light');
                }
            }
        }
    }
    
    toggleVideoStream() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                this.isVideoOff = !videoTrack.enabled;
                
                // Update UI
                const icon = this.videoBtn.querySelector('i');
                const headerIcon = this.toggleVideo.querySelector('i');
                
                if (this.isVideoOff) {
                    icon.className = 'fas fa-video-slash';
                    headerIcon.className = 'fas fa-video-slash';
                    this.videoBtn.classList.add('btn-danger');
                    this.videoBtn.classList.remove('btn-outline-light');
                } else {
                    icon.className = 'fas fa-video';
                    headerIcon.className = 'fas fa-video';
                    this.videoBtn.classList.remove('btn-danger');
                    this.videoBtn.classList.add('btn-outline-light');
                }
            }
        }
    }
    
    async applySettings() {
        try {
            const constraints = {
                video: {
                    deviceId: this.cameraSelect.value ? { exact: this.cameraSelect.value } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: {
                    deviceId: this.microphoneSelect.value ? { exact: this.microphoneSelect.value } : undefined,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            };
            
            // Get new stream with selected devices
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Replace tracks in peer connection
            if (this.peerConnection) {
                const sender = this.peerConnection.getSenders();
                sender.forEach(s => {
                    if (s.track) {
                        if (s.track.kind === 'video') {
                            s.replaceTrack(newStream.getVideoTracks()[0]);
                        } else if (s.track.kind === 'audio') {
                            s.replaceTrack(newStream.getAudioTracks()[0]);
                        }
                    }
                });
            }
            
            // Update local video
            this.localVideo.srcObject = newStream;
            
            // Stop old stream
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
            }
            
            this.localStream = newStream;
            
            // Close settings modal
            bootstrap.Modal.getInstance(document.getElementById('callSettingsModal')).hide();
            
        } catch (error) {
            console.error('Error applying settings:', error);
            this.showError('Failed to apply settings. Please try again.');
        }
    }
    
    sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addChatMessage('You', message, 'sent');
            this.chatInput.value = '';
            
            // In a real app, send this message to the other peer
            // For now, simulate a response
            setTimeout(() => {
                this.addChatMessage('Doctor', 'Thank you for the message. I understand your concern.', 'received');
            }, 1000);
        }
    }
    
    addChatMessage(sender, message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-2 ${type === 'sent' ? 'text-end' : 'text-start'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `d-inline-block p-2 rounded ${type === 'sent' ? 'bg-primary text-white' : 'bg-light'}`;
        messageContent.innerHTML = `
            <small class="d-block fw-bold">${sender}</small>
            ${message}
        `;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showConnectionStatus(message) {
        this.connectionStatus.style.display = 'block';
        this.connectionStatus.querySelector('p').textContent = message;
    }
    
    hideConnectionStatus() {
        this.connectionStatus.style.display = 'none';
    }
    
    updateCallStatus(status) {
        this.callStatus.textContent = status;
    }
    
    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        new bootstrap.Modal(document.getElementById('errorModal')).show();
    }
    
    endCallSession() {
        this.isCallActive = false;
        
        // Stop all tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        
        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        
        // Redirect to appropriate home page depending on role
        setTimeout(() => {
            var isDoctor = window.location.pathname.startsWith('/doctor/');
            window.location.href = isDoctor ? '/doctor/dashboard' : '/patient/home';
        }, 1000);
    }
}

// Initialize video call when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if browser supports WebRTC
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support video calls. Please use a modern browser like Chrome, Firefox, or Safari.');
        var isDoctor = window.location.pathname.startsWith('/doctor/');
        window.location.href = isDoctor ? '/doctor/dashboard' : '/patient/home';
        return;
    }
    
    // Initialize video call manager
    window.videoCallManager = new VideoCallManager();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            window.videoCallManager.toggleMuteAudio();
        } else if (e.key === 'v' || e.key === 'V') {
            window.videoCallManager.toggleVideoStream();
        } else if (e.key === 'Escape') {
            window.videoCallManager.endCallSession();
        }
    });
    
    // Show settings modal with Ctrl/Cmd + ,
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            new bootstrap.Modal(document.getElementById('callSettingsModal')).show();
        }
    });
});
