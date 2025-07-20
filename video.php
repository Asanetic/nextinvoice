<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spectra Pro Demo Recorder</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #f8f9fa; padding-top: 40px; }
    .phone-mockup {
      width: 360px;
      height: 640px;
      background: white;
      border: 2px solid #ccc;
      border-radius: 30px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      margin: 0 auto;
      overflow: hidden;
      padding: 20px;
      position: relative;
      animation: pulse 1s ease-in-out infinite alternate;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.01); }
    }

    .typing-text::after {
      content: '|';
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    .invoice-line {
      background: #e9ecef;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 5px;
      font-size: 14px;
    }
  </style>
</head>
<body>

<div class="container text-center">
  <h3>🎥 Spectra Pro Demo Recorder</h3>

  <!-- 🎧 Embedded Audio (TTS Voice) -->
  <audio id="voiceover" controls>
    <source src="./terminal/spectra_voice_output.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>

  <!-- 📱 Fake UI Demo -->
  <div class="phone-mockup my-4" id="animationContainer">
    <div class="typing-text mb-3">Creating Invoice...</div>
    <div class="invoice-line">🛒 Web Design - KES 15,000</div>
    <div class="invoice-line">🌐 Domain - KES 1,200</div>
    <div class="invoice-line">☁️ Hosting - KES 3,000</div>
    <div class="invoice-line">📧 Client: mwangi@biz.co.ke</div>
    <div class="mt-4">
      <button class="btn btn-success">Send Invoice</button>
    </div>
  </div>

  <!-- 🎬 Controls -->
  <button id="startBtn" class="btn btn-primary me-2">Start Recording</button>
  <button id="stopBtn" class="btn btn-danger" disabled>Stop & Download</button>
</div>

<script>
  let mediaRecorder;
  let chunks = [];

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const audio = document.getElementById('voiceover');

  startBtn.onclick = async function () {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true  // Important: Capture tab/system audio
    });

    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spectra_demo_recording.webm';
      a.click();
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;

    // Play audio as you start recording
    audio.play();
  };

  stopBtn.onclick = function () {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
</script>

</body>
</html>
