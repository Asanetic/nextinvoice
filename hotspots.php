<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Hotspot Connect</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .fade-out {
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      pointer-events: none;
    }
    .fade-in {
      opacity: 1 !important;
      transform: translateY(0px) !important;
    }
    #form-section {
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease-in-out;
    }
  </style>
</head>
<body class="bg-[#0b0f2f] text-white font-sans">

  <!-- Header -->
  <header class="bg-gradient-to-r from-purple-500 to-[#0b0f2f] text-white text-center py-6 shadow-lg">
    <h1 class="text-4xl font-bold">Hotspot Connect</h1>
    <p class="text-lg mt-2">Reliable, fast internet with a luxurious feel.</p>
  </header>

  <div class="container mx-auto px-4 py-10" id="main-section">

    <!-- Plan Selection -->
    <div id="plans-section" class="text-center transition-all duration-500">
      <h2 class="text-2xl font-semibold mb-8">Choose Your Plan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Plan Card -->
        <button onclick="selectPlan('basic')" class="w-full">
          <div id="plan-basic" class="bg-[#111] rounded-2xl shadow-md p-6 hover:shadow-purple-500 transition transform hover:-translate-y-1 cursor-pointer">
            <h3 class="text-xl font-semibold mb-2">Basic</h3>
            <p class="mb-1">2GB / 1 Day</p>
            <h4 class="text-purple-400 font-bold text-2xl">KES 50</h4>
          </div>
        </button>

        <button onclick="selectPlan('standard')" class="w-full">
          <div id="plan-standard" class="bg-[#111] rounded-2xl shadow-md p-6 hover:shadow-purple-500 transition transform hover:-translate-y-1 cursor-pointer">
            <h3 class="text-xl font-semibold mb-2">Standard</h3>
            <p class="mb-1">5GB / 3 Days</p>
            <h4 class="text-purple-400 font-bold text-2xl">KES 120</h4>
          </div>
        </button>

        <button onclick="selectPlan('premium')" class="w-full">
          <div id="plan-premium" class="bg-[#111] rounded-2xl shadow-md p-6 hover:shadow-purple-500 transition transform hover:-translate-y-1 cursor-pointer">
            <h3 class="text-xl font-semibold mb-2">Premium</h3>
            <p class="mb-1">15GB / 7 Days</p>
            <h4 class="text-purple-400 font-bold text-2xl">KES 300</h4>
          </div>
        </button>
      </div>
    </div>

    <!-- Form Section -->
    <div id="form-section" class="max-w-xl mx-auto mt-10 transition-all duration-500">
      <div class="bg-[#111] rounded-2xl shadow-lg p-6">
        <h3 class="text-xl font-semibold text-center mb-4">Create an Account</h3>
        <form action="submit_account.php" method="POST">
          <input type="hidden" name="package" id="selectedPackage">
          <div class="mb-4">
            <label class="block mb-1 text-sm">Full Name</label>
            <input type="text" name="username" class="w-full p-2 rounded-md bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-sm">Phone Number</label>
            <input type="text" name="phone" class="w-full p-2 rounded-md bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none" required />
          </div>
          <button type="submit" class="w-full bg-purple-500 hover:bg-purple-600 transition text-white py-2 rounded-md font-semibold">Sign Up & Connect</button>
        </form>
      </div>
    </div>

    <!-- Support CTA -->
    <div class="text-center mt-10">
      <p class="text-lg mb-3">Need help? Talk to our support team.</p>
      <a href="tel:+254700123456" class="inline-block border border-white text-white px-5 py-2 rounded-lg hover:bg-purple-600 transition">Call Support</a>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-black text-gray-400 text-center py-4 mt-10 text-sm">
    &copy; <?= date('Y'); ?> Hotspot Connect — Powered by Asanetic Digital
  </footer>

  <!-- Script -->
  <script>
    function selectPlan(plan) {
      // Highlight selected (optional)
      document.querySelectorAll('[id^="plan-"]').forEach(p => p.classList.remove('ring-2', 'ring-purple-500'));
      document.getElementById("plan-" + plan).classList.add('ring-2', 'ring-purple-500');

      // Set selected package
      document.getElementById('selectedPackage').value = plan;

      // Hide plans
      const plans = document.getElementById('plans-section');
      plans.classList.add('fade-out');

      // Show form after fade
      setTimeout(() => {
        plans.style.display = 'none';
        const form = document.getElementById('form-section');
        form.style.display = 'block';
        setTimeout(() => form.classList.add('fade-in'), 50);
        form.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  </script>

</body>
</html>
