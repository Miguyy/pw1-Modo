<script setup>
import NavBar from '../Components/NavBar.vue'
</script>

<template>
  <div class="landing-page">
    <div class="navbar-layer">
      <NavBar />
    </div>

    <section class="hero-section">
      <div class="wave-back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 1019" preserveAspectRatio="none">
          <path
            d="M572 917.5C481 1000.92 206.5 1045 0 1002V0H1512V534C1484 518.5 1403.5 470.468 1273.5 505.5C1143.5 540.533 1114.46 592.339 1054 667.5C1017 713.5 962.36 780.701 863.5 795.5C780 808 638.21 856.808 572 917.5Z"
            fill="#CBEDDA"
          />
        </svg>
      </div>

      <div class="wave-front">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 985" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroGradient" x1="756" y1="-239" x2="756" y2="968.18">
              <stop stop-color="#355D4C" stop-opacity="0.9" />
              <stop offset="0.58" stop-color="#97DBB4" />
            </linearGradient>
          </defs>

          <path
            d="M520 923C397.112 1011.97 206.5 990 0 947V0H1512V461.5C1460.5 443.5 1413.5 414.286 1317.5 428C1201.5 444.571 1162 512 1094.5 588C962.678 736.422 906.16 730.589 754 775.5C640.5 809 616 853.5 520 923Z"
            fill="url(#heroGradient)"
          />
        </svg>
      </div>

      <div class="hero-content">
        <div class="container">
          <h1 class="hero-title">
            Change your <br /><span class="highlight">habits</span> create <br />
            your <span class="highlight">new you</span>.
          </h1>
          <p class="hero-description">
            Turn your goals into quests to beat <br />procrastination and boost your productivity!
          </p>
          <div class="ms-auto">
            <RouterLink class="letsStart-btn" to="/login"> Let's start </RouterLink>
          </div>
          <div class="hero-image">
            <img src="../images/people.png" alt="Hero Image" />
          </div>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="wave-back-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 1639" preserveAspectRatio="none">
          <path
            d="M419 54C320.869 0.209347 185.664 0.000562976 0 0V1639H1512V269.5C1272.5 269.5 1263 171.948 1104.5 161.5C967.68 152.481 905.963 218.279 736 206.5C566.037 194.721 566.5 134.852 419 54Z"
            fill="#355D4C"
          />
        </svg>

        <div class="faq-section container">
          <div class="faq-title text-center mb-4">
            <h2>Got questions? We got answers!</h2>
          </div>

          <div class="accordion" id="faqAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  What is Modo?
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">
                  Modo is a habit tracker to help you improve your habits. It gamifies your life by
                  giving you points for each completed task as rewards.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Is there an iOS or Android App?
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">
                  No! Modo isn’t available on iOS or Android phones yet. You can sign-up here and
                  download the app when it’s available.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  How many habits can I track?
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">As many as you like!</div>
              </div>
            </div>
          </div>
        </div>
        <footer class="site-footer inside-wave">
          <div class="footer-inner">
            <div class="footer-brand">
              <img src="../images/modoIcon.png" alt="Modo" class="footer-logo" />
              <p class="footer-tag">The best tracker to change who you are.</p>
              <p class="footer-copy">Copyright 2025 Modo Services, Inc. All Rights Reserved.</p>
            </div>

            <div class="footer-columns">
              <div class="footer-col">
                <h4>Products</h4>
                <ul>
                  <li>
                    <a href="#" style="text-decoration: none; color: #ededed">iOS App</a>
                  </li>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Android App</a></li>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Web App</a></li>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Updates</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <h4>About</h4>
                <ul>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Our Team</a></li>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Our Mission</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <h4>Legal</h4>
                <ul>
                  <li><a href="#" style="text-decoration: none; color: #ededed">Privacy</a></li>
                  <li>
                    <a href="#" style="text-decoration: none; color: #ededed">Terms of Service</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <div class="wave-back-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1028"
          height="323"
          viewBox="0 0 1028 323"
          fill="none"
        >
          <path
            d="M404.728 63.1583C201 80.6583 175.5 145.158 0 145.158V322.658H1027.5V0.15901C905.5 -4.34081 832 88.158 700 88.1582C615 88.1583 558.163 49.9784 404.728 63.1583Z"
            fill="#97DBB4"
          />
        </svg>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
<style src="../css/styles.css"></style>
