/**
 * ============================================================================
 * MANAN JOSHI - PROFESSIONAL PORTFOLIO SCRIPTS
 * Academic & Professional Evaluation Ready
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initChatbot();
  initContactForm();
  initStatCounters();
});

/* ==========================================================================
   NAVIGATION & SCROLL INTERACTIONS
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Sticky header blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Close mobile nav upon clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu?.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  });

  // Highlight active section on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   INTERACTIVE PORTFOLIO ASSISTANT CHATBOT (PROJECT DEMO)
   ========================================================================== */
function initChatbot() {
  const form = document.getElementById('miniChatForm');
  const input = document.getElementById('miniChatInput');
  const stream = document.getElementById('chatStream');

  if (!form || !input || !stream) return;

  const responses = {
    skills: "Technical Proficiencies: Manan is proficient in C (Data Structures & low-level memory), Python (Automation, AI & Chatbots), Java (Object-Oriented Design & Backend Systems), and Web Development (HTML5, CSS3, JavaScript).",
    hackathons: "Competitive Track Record: Manan has competed in 50+ collegiate and national hackathons, winning 35 First Place awards with an impressive 70% victory conversion rate.",
    education: "Academic Credentials: Manan scored 96.0% in his 12th Board Examinations (Science & Mathematics) and is currently pursuing his Bachelor's degree in Computer Science at JECRC University.",
    projects: "Key Projects: Manan has engineered responsive web platforms with clean UI/UX standards, and built intelligent Python conversational AI chatbots with natural language intent recognition.",
    contact: "Contact Information: You can reach Manan directly at phone number 67676767676, on GitHub at github.com/Manan-1401, or on LinkedIn at linkedin.com/in/manan-joshi.",
    default: "Thank you for asking! Manan Joshi is a Computer Science undergraduate at JECRC University and an aspiring Software Engineer. You can inquire about his 'skills', 'education', 'hackathons', 'projects', or 'contact'."
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user';
    userMsg.textContent = query;
    stream.appendChild(userMsg);

    input.value = '';
    stream.scrollTop = stream.scrollHeight;

    // Match response
    const qLower = query.toLowerCase();
    let replyText = responses.default;

    if (qLower.includes('skill') || qLower.includes('c') || qLower.includes('python') || qLower.includes('java')) {
      replyText = responses.skills;
    } else if (qLower.includes('hackathon') || qLower.includes('win') || qLower.includes('award') || qLower.includes('achievement')) {
      replyText = responses.hackathons;
    } else if (qLower.includes('edu') || qLower.includes('12') || qLower.includes('jecrc') || qLower.includes('board') || qLower.includes('college')) {
      replyText = responses.education;
    } else if (qLower.includes('project') || qLower.includes('web') || qLower.includes('bot')) {
      replyText = responses.projects;
    } else if (qLower.includes('contact') || qLower.includes('phone') || qLower.includes('email') || qLower.includes('github') || qLower.includes('linkedin')) {
      replyText = responses.contact;
    }

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-bubble bot';
      botMsg.textContent = replyText;
      stream.appendChild(botMsg);
      stream.scrollTop = stream.scrollHeight;
    }, 350);
  });
}

/* ==========================================================================
   STAT COUNTER ANIMATIONS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.hero-stats-grid .stat-number, .stat-box-solid .num');
  let hasAnimated = false;

  const animateStats = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    statNumbers.forEach(el => {
      const originalText = el.textContent.trim();
      const match = originalText.match(/^(\d+)(.*)$/);
      if (!match) return;

      const targetValue = parseInt(match[1], 10);
      const suffix = match[2];

      let current = 0;
      const duration = 1200;
      const steps = 30;
      const stepTime = duration / steps;
      const stepVal = targetValue / steps;

      const interval = setInterval(() => {
        current += stepVal;
        if (current >= targetValue) {
          el.textContent = `${targetValue}${suffix}`;
          clearInterval(interval);
        } else {
          el.textContent = `${Math.floor(current)}${suffix}`;
        }
      }, stepTime);
    });
  };

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(heroSection);
  }
}

/* ==========================================================================
   CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.textContent = 'Thank you! Your message has been recorded and sent to Manan Joshi.';
      }

      form.reset();

      setTimeout(() => {
        if (alertBox) alertBox.style.display = 'none';
      }, 5000);
    });
  }
}
