<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Hotspot Connect</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    body {
      background: #0b0f2f;
      color: #fff;
      font-family: 'Segoe UI', sans-serif;
    }

    .bg-lux {
      background: linear-gradient(to right, #7f5af0, #0b0f2f);
    }

    .lux-card {
      border-radius: 20px;
      background-color: #111;
      color: #fff;
      box-shadow: 0 10px 30px rgba(127, 90, 240, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .lux-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(127, 90, 240, 0.4);
    }

    .lux-active {
      border: 2px solid #7f5af0;
      box-shadow: 0 0 12px #7f5af0;
    }

    .btn-purple {
      background-color: #7f5af0;
      color: white;
    }

    .btn-purple:hover {
      background-color: #9a7ff9;
    }

    .fade-custom {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease-in-out;
    }

    .fade-custom.show {
      opacity: 1;
      pointer-events: auto;
    }

    .back-link {
      font-size: 0.875rem;
      color: #bbb;
      background: none;
      border: none;
      margin-top: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
    }

    .back-link:hover {
      color: #fff;
      text-decoration: none;
    }

    .footer-dark {
      background-color: #000;
      padding: 30px 0;
      text-align: center;
      color: #aaa;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="bg-lux text-white p-4 text-center">
    <h1 class="display-5 fw-bold">Hotspot Connect</h1>
    <p class="lead">Reliable, fast internet with a luxurious feel.</p>
  </header>

  <!-- Main Container -->
  <div class="container py-5" id="main-section">

    <!-- Plan Selection -->
    <div id="plans-section" class="fade-custom show">
      <h2 class="text-center mb-4">Choose Your Plan</h2>
      <div class="row text-center">
        <div class="col-md-4 mb-4">
          <button onclick="selectPlan('basic')" class="w-100 bg-transparent border-0">
            <div class="p-4 lux-card" id="plan-basic">
              <h4>Basic</h4>
              <p>2GB / 1 Day</p>
              <h3>KES 50</h3>
            </div>
          </button>
        </div>
        <div class="col-md-4 mb-4">
          <button onclick="selectPlan('standard')" class="w-100 bg-transparent border-0">
            <div class="p-4 lux-card" id="plan-standard">
              <h4>Standard</h4>
              <p>5GB / 3 Days</p>
              <h3>KES 120</h3>
            </div>
          </button>
        </div>
        <div class="col-md-4 mb-4">
          <button onclick="selectPlan('premium')" class="w-100 bg-transparent border-0">
            <div class="p-4 lux-card" id="plan-premium">
              <h4>Premium</h4>
              <p>15GB / 7 Days</p>
              <h3>KES 300</h3>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Account Creation Form -->
    <div id="form-section" class="fade-custom show d-none">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="p-4 lux-card">
            <h3 class="text-center mb-3">Create an Account</h3>
            <form  method="POST">
              <input type="hidden" name="package" id="selectedPackage">

              <div class="mb-3">
                <label for="username" class="form-label">Full Name</label>
                <input type="text" class="form-control" name="username" required />
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="text" class="form-control" name="phone" required />
              </div>

              <button type="submit" class="btn btn-purple w-100">Sign Up & Connect</button>

              <div class="text-center">
                <button type="button" class="back-link" onclick="backToPlans()">
                  <span>&larr;</span> Back to Plans
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Support CTA -->
    <div class="text-center mt-5">
      <p class="fs-5">Need help? Talk to our support team.</p>
      <a href="tel:+254700123456" class="btn btn-outline-light">Call Support</a>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer-dark">
    &copy; <?= date('Y'); ?> Hotspot Connect
  </footer>

  <!-- JavaScript -->
  <script>
    function selectPlan(plan) {
      document.querySelectorAll('.lux-card').forEach(card => card.classList.remove('lux-active'));
      document.getElementById('plan-' + plan).classList.add('lux-active');

      document.getElementById('selectedPackage').value = plan;

      document.getElementById('plans-section').classList.add('d-none');
      document.getElementById('form-section').classList.remove('d-none');
    }

    function backToPlans() {
      document.getElementById('form-section').classList.add('d-none');
      document.getElementById('plans-section').classList.remove('d-none');
    }
  </script>

</body>
</html>
