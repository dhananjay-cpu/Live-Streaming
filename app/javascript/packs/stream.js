const init = async () => {
  
    await handlePermissions();
    await getDevices();
  
    window.broadcastClient = IVSBroadcastClient.create({
      streamConfig: IVSBroadcastClient.STANDARD_LANDSCAPE,
    });
  
    await createVideoStream();
    await createAudioStream();
    
    previewVideo();
    
    document.getElementById('cam-select').addEventListener('change', selectCamera);
    document.getElementById('mic-select').addEventListener('change', selectMic);
    document.getElementById('stream-btn').addEventListener('click', toggleBroadcast);
    document.getElementById('screenshare-btn').addEventListener('click', toggleScreenshare);
    document.getElementById('overlay-btn').addEventListener('click', showOverlay);
  };
  
  const handlePermissions = async () => {
    let permissions = { video: true, audio: true };
    try {
      await navigator.mediaDevices.getUserMedia(permissions);
    }
    catch (err) {
      console.error(err.message);
      permissions = { video: false, audio: false };
    }
    if (!permissions.video) console.error('Failed to get video permissions.');
    if (!permissions.audio) console.error('Failed to get audio permissions.');
  };
  
  const getDevices = async () => {
    const cameraSelect = document.getElementById('cam-select');
    const micSelect = document.getElementById('mic-select');
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === 'videoinput');
    const audioDevices = devices.filter((d) => d.kind === 'audioinput');
    videoDevices.forEach((device, idx) => {
      const opt = document.createElement('option');
      opt.value = device.deviceId;
      opt.innerHTML = device.label;
      if (idx === 0) {
        window.selectedVideoDeviceId = device.deviceId;
        opt.selected = true;
      }
      cameraSelect.appendChild(opt);
    });
    audioDevices.forEach((device, idx) => {
      const opt = document.createElement('option');
      opt.value = device.deviceId;
      opt.innerHTML = device.label;
      if (idx === 0) {
        window.selectedAudioDeviceId = device.deviceId;
        opt.selected = true;
      }
      micSelect.appendChild(opt);
    });
  };
  
  const createVideoStream = async () => {
    if (window.broadcastClient && window.broadcastClient.getVideoInputDevice('camera1')) window.broadcastClient.removeVideoInputDevice('camera1');
    const streamConfig = IVSBroadcastClient.STANDARD_LANDSCAPE;
    window.videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: window.selectedVideoDeviceId },
        width: {
          ideal: streamConfig.maxResolution.width,
          max: streamConfig.maxResolution.width,
        },
        height: {
          ideal: streamConfig.maxResolution.height,
          max: streamConfig.maxResolution.height,
        },
      },
    });
    if (window.broadcastClient) window.broadcastClient.addVideoInputDevice(window.videoStream, 'camera1', { index: 0 });
  };
  
  const createAudioStream = async () => {
    if (window.broadcastClient && window.broadcastClient.getAudioInputDevice('mic1')) window.broadcastClient.removeAudioInputDevice('mic1');
    window.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: window.selectedAudioDeviceId
      },
    });
    if (window.broadcastClient) window.broadcastClient.addAudioInputDevice(window.audioStream, 'mic1');
  };
  
  const selectCamera = async (e) => {
    window.selectedVideoDeviceId = e.target.value;
    await createVideoStream();
  };
  
  const selectMic = async (e) => {
    window.selectedAudioDeviceId = e.target.value;
    await createAudioStream();
  };
  
  const previewVideo = () => {
    const previewEl = document.getElementById('broadcast-preview');
    window.broadcastClient.attachPreview(previewEl);
  };
  
  const toggleBroadcast = () => {
    if(!window.isBroadcasting) {
      startBroadcast();
    }
    else {
      stopBroadcast();
    }
  };
  
  const broadcastReady = () => {
    const key = document.getElementById('stream-key').value;
    const endpoint = document.getElementById('endpoint').value;
    
    if(!key && !endpoint) {
      alert('Please enter a Stream Key and Ingest Endpoint!');
      return false;
    }
    return true;
  }
  
  const startBroadcast = () => {
    const key = document.getElementById('stream-key').value;
    const endpoint = document.getElementById('endpoint').value;
    const streamBtn = document.getElementById('stream-btn');
    const onlineIndicator = document.getElementById('online-indicator');
    
    if(broadcastReady()) {
      window.broadcastClient
        .startBroadcast(key, endpoint)
        .then(() => {
          streamBtn.innerHTML = 'Stop';
          onlineIndicator.classList.remove('d-none');
          window.isBroadcasting = true;
        })
        .catch((error) => {
          streamBtn.innerHTML = 'Stream';
          onlineIndicator.classList.add('d-none');
          window.isBroadcasting = false;
          console.error(error);
        });  
    }
  };
  
  const stopBroadcast = () => {
    window.broadcastClient.stopBroadcast();
    window.isBroadcasting = false;
    document.getElementById('stream-btn').innerHTML = 'Stream';
    document.getElementById('online-indicator').classList.add('d-none');
  };
  
  const toggleScreenshare = async (e) => {
      const screenshareBtn = e.currentTarget;
      if(!broadcastReady()) return;
      if (!window.isSharingScreen) {
          await shareScreen();
          if (!window.isBroadcasting) startBroadcast();
          screenshareBtn.innerHTML = 'Stop Screen Share';
          screenshareBtn.classList.remove('btn-outline-primary');
          screenshareBtn.classList.add('btn-danger');
          window.isSharingScreen = true;
      }
      else {
          screenshareBtn.innerHTML = 'Share Screen';
          screenshareBtn.classList.add('btn-outline-primary');
          screenshareBtn.classList.remove('btn-danger');
          window.isSharingScreen = false;
          await createVideoStream();
      }
  };
  
  const shareScreen = async () => {
      if (window.broadcastClient && window.broadcastClient.getVideoInputDevice('camera1')) {
        window.broadcastClient.removeVideoInputDevice('camera1');
      }
      window.videoStream = await navigator.mediaDevices.getDisplayMedia();
      if (window.broadcastClient) {
        window.broadcastClient.addVideoInputDevice(window.videoStream, 'camera1', { index: 0 });
      }
  };
  
  const showOverlay = () => {
      const preview = document.getElementById('broadcast-preview');
      const overlay = document.createElement('canvas');
      overlay.width = preview.width;
      overlay.height = preview.height;
      overlay.style.display = 'none';
      let ctx = overlay.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, overlay.height - 220, overlay.width, 220);
  
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
  
      ctx.font = 'bold 120px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Amazon IVS Web Broadcast', 30, overlay.height - 100);
  
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Canvas Overlay Demo', 40, overlay.height - 40);
  
      document.querySelector('body').appendChild(overlay);
  
      window.broadcastClient.addImageSource(overlay, 'overlay1', { index: 1 });
  
      setTimeout(() => {
          window.broadcastClient.removeImage('overlay1');
          overlay.remove();
      }, 10000);
  };
  
  document.addEventListener('DOMContentLoaded', init);
  