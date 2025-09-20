    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function (m) {
            return ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
                })[m];
            });
}
    
    const apiKeyInput = document.getElementById('api-key');
    const chatDiv = document.getElementById('chat');
    const inputField = document.getElementById('input');
    const sendButton = document.getElementById('send');

    
        /* JavaScript - Easy to extract to script.js */

        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('nav ul');
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add active class to navigation items on scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('nav a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Add scroll effect to header
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(26, 35, 126, 0.98)';
            } else {
                header.style.background = 'rgba(26, 35, 126, 0.95)';
            }
        });

        // Animate skill cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all skill categories and project cards
        document.querySelectorAll('.skill-category, .project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Add typing effect to hero text (optional enhancement)
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // Initialize typing effect on page load
        window.addEventListener('load', function() {
            const heroSubtext = document.querySelector('.hero p');
            const originalText = heroSubtext.textContent;
            typeWriter(heroSubtext, originalText, 30);
        });


    // Load saved key on page load
    window.addEventListener('DOMContentLoaded', () => {
      const savedKey = localStorage.getItem('openai-api-key');
      if (savedKey) {
        apiKeyInput.value = savedKey;
      }
    });

    // Save key when changed
    apiKeyInput.addEventListener('change', () => {
      localStorage.setItem('openai-api-key', apiKeyInput.value.trim());
    });

    const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];

    async function sendMessage() {
      const userInput = inputField.value.trim();
      if (!userInput) return;

      const apiKey = apiKeyInput.value.trim();
      if (!apiKey) {
        chatDiv.innerHTML += `<p><strong>Error:</strong> API key is missing.</p>`;
        return;
      }

      // Display user message
      chatDiv.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
      messages.push({ role: 'user', content: userInput });
      inputField.value = '';

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4.1-mini',
            messages: messages,
            max_tokens: 200
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );

        const reply = response.data.choices[0].message.content.trim();
        chatDiv.innerHTML += `<p><strong>Assistant:</strong> ${reply}</p>`;
        messages.push({ role: 'assistant', content: reply });
        chatDiv.scrollTop = chatDiv.scrollHeight; // Auto-scroll
      } catch (error) {
        console.error('Error:', error);
        chatDiv.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
      }
    }

    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') sendMessage();
    });