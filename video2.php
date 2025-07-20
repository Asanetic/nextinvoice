<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spectra Pro - Render to Video</title>
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
    }
    .invoice-line {
      background: #e9ecef;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 5px;
      font-size: 14px;
      animation: fadeIn 1s ease-in-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

<div class="container text-center">
  <h3>Spectra Pro Rendered Demo 🎬</h3>

  <!-- 🎧 Embedded Audio -->
  <audio id="voiceover" src="terminal/spectra_voice_output.mp3"></audio>

  <!-- 📱 UI Demo Container -->
  <div class="phone-mockup my-4" id="captureArea">
    <div class="invoice-line">🛒 Web Design - KES 15,000</div>
    <div class="invoice-line">🌐 Domain - KES 1,200</div>
    <div class="invoice-line">☁️ Hosting - KES 3,000</div>
    <div class="invoice-line">📧 Client: mwangi@biz.co.ke</div>
    <div class="mt-4">
      <button class="btn btn-success">Send Invoice</button>
    </div>
  </div>

  <!-- 🎬 Download Trigger -->
  <button id="renderBtn" class="btn btn-primary">Render and Download MP4</button>
</div>

<script type="module">
  import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/ffmpeg.mjs';

  const ffmpeg = createFFmpeg({ log: true });
  const renderBtn = document.getElementById('renderBtn');
  const voiceover = document.getElementById('voiceover');

  renderBtn.onclick = async () => {
    renderBtn.innerText = 'Rendering...';

    // Use html2canvas to snapshot frames
    const html2canvas = (await import('https://cdn.skypack.dev/html2canvas')).default;
    const frames = [];
    const captureArea = document.getElementById('captureArea');

    for (let i = 0; i < 30; i++) { // ~1 second at 30fps
      const canvas = await html2canvas(captureArea);
      frames.push(canvas);
      await new Promise(r => setTimeout(r, 33));
    }

    await ffmpeg.load();

    // Write each frame into the FFmpeg FS
    for (let i = 0; i < frames.length; i++) {
      const canvas = frames[i];
      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg'));
      const buffer = await blob.arrayBuffer();
      ffmpeg.FS('writeFile', `frame${String(i).padStart(3, '0')}.jpg`, new Uint8Array(buffer));
    }

    // Write audio file
    const audioBlob = await fetch(voiceover.src).then(r => r.blob());
    const audioBuffer = await audioBlob.arrayBuffer();
    ffmpeg.FS('writeFile', 'audio.mp3', new Uint8Array(audioBuffer));

    // Create video from images + audio
    await ffmpeg.run(
      '-framerate', '30',
      '-i', 'frame%03d.jpg',
      '-i', 'audio.mp3',
      '-shortest',
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      'output.mp4'
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spectra_rendered.mp4';
    a.click();

    renderBtn.innerText = 'Render and Download MP4';
  };
</script>

</body>
</html>