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

    .form-section {
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease;
    }

    .form-section.show {
      display: block;
      opacity: 1;
      transform: translateY(0px);
    }

    .footer-dark {
      background-color: #000;
      padding: 30px 0;
      text-align: center;
      color: #aaa;
    }

    .select-btn {
      border: none;
      background: none;
      color: inherit;
      padding: 0;
    }
  </style>
</head>
<body>

  <header class="bg-lux text-white p-4 text-center">
    <h1 class="display-5 fw-bold">Hotspot Connect</h1>
    <p class="lead">Reliable, fast internet with a luxurious feel.</p>
  </header>

  <div class="container py-5">

    <!-- Package Selection -->
    <div class="row mb-5 text-center">
      <h2 class="mb-4">Choose Your Plan</h2>
      <div class="col-md-4">
        <button class="select-btn w-100" onclick="selectPlan('basic')">
          <div class="p-4 lux-card" id="plan-basic">
            <h4>Basic</h4>
            <p>2GB / 1 Day</p>
            <h3>KES 50</h3>
          </div>
        </button>
      </div>
      <div class="col-md-4">
        <button class="select-btn w-100" onclick="selectPlan('standard')">
          <div class="p-4 lux-card" id="plan-standard">
            <h4>Standard</h4>
            <p>5GB / 3 Days</p>
            <h3>KES 120</h3>
          </div>
        </button>
      </div>
      <div class="col-md-4">
        <button class="select-btn w-100" onclick="selectPlan('premium')">
          <div class="p-4 lux-card" id="plan-premium">
            <h4>Premium</h4>
            <p>15GB / 7 Days</p>
            <h3>KES 300</h3>
          </div>
        </button>
      </div>
    </div>

    <!-- Account Creation Form -->
    <div class="row justify-content-center mb-5 form-section col-md-12 " id="form-section">
      <div class="col-md-4">
        <div class="p-4 lux-card">
          <h3 class="text-center mb-3">Create an Account</h3>
          <form action="submit_account.php" method="POST">
            <input type="hidden" id="selectedPackage" name="package" value="">
            <div class="mb-3">
              <label for="username" class="form-label">Full Name</label>
              <input type="text" class="form-control" name="username" required />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone Number</label>
              <input type="text" class="form-control" name="phone" required />
            </div>
            <button type="submit" class="btn btn-purple w-100">Sign Up & Connect</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Support Call-to-Action -->
    <div class="text-center">
      <p class="fs-5">Need help? Talk to our support team.</p>
      <a href="tel:+254700123456" class="btn btn-outline-light">Call Support</a>
    </div>
  </div>

  <footer class="footer-dark">
    &copy; <?= date('Y'); ?> Hotspot Connect — Powered by Asanetic Digital
  </footer>

  <script>
    function selectPlan(plan) {
      // Remove active class from all
      document.querySelectorAll('.lux-card').forEach(card => card.classList.remove('lux-active'));

      // Add to selected
      const selectedCard = document.getElementById('plan-' + plan);
      selectedCard.classList.add('lux-active');

      // Set hidden input
      document.getElementById('selectedPackage').value = plan;

      // Show form
      const form = document.getElementById('form-section');
      form.classList.add('show');
      form.scrollIntoView({ behavior: 'smooth' });
    }
  </script>

</body>
</html>
