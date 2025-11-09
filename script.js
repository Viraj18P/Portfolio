document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupSmoothScroll();
    loadGitHubProjects();
    setupHamburgerMenu();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = 'home'; // Default to 'home'
        const sections = document.querySelectorAll('.section, #home');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                closeHamburgerMenu(); // Close menu on link click
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function closeHamburgerMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');
}

async function loadGitHubProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const username = 'Viraj18P'; // Your GitHub username

    try {
        // Fetch repositories, sorted by most recently updated, max 6
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.status}`);
        }

        const repos = await response.json();

        if (repos.length === 0) {
            projectsGrid.innerHTML = '<p class="loading">No public projects found.</p>';
            return;
        }

        projectsGrid.innerHTML = ''; // Clear the "Loading..." message

        repos.forEach((repo, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.style.animationDelay = `${index * 100}ms`; // Stagger animation

            const description = repo.description || 'No description available.';
            const repoLink = repo.html_url;
            // Use repo.homepage if it exists, otherwise no demo link
            const demoLink = repo.homepage; 

            projectCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                <div class="project-languages">
                    ${repo.language ? `<span class="language-tag">${repo.language}</span>` : ''}
                </div>
                <div class="project-links">
                    <a href="${repoLink}" target="_blank" class="project-link">GitHub →</a>
                    ${demoLink ? `<a href="${demoLink}" target="_blank" class="project-link">Live Demo →</a>` : ''}
                </div>
            `;

            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = `
            <div class="loading">
                <p>Unable to load projects from GitHub.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    <a href="https://github.com/${username}" target="_blank" style="color: var(--primary); text-decoration: underline;">
                        Visit GitHub Profile Manually
                    </a>
                </p>
            </div>
        `;
    }
}