import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '#about', label: 'Sobre Mim' },
  { href: '#projects', label: 'Projetos' },
  { href: '#experience', label: 'Carreira' },
  { href: '#ben-ai', label: 'Ben.AI' },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbar = document.querySelector('header');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }

    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50 backdrop-blur-lg">
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <a 
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-2xl font-bold text-white hover:text-green-400 transition-colors green-glow cursor-pointer"
        >
          David Ben<span className="text-green-400">.</span>
        </a>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-lg font-medium transition-colors cursor-pointer ${
                activeSection === link.href.substring(1)
                  ? 'text-green-400 green-glow'
                  : 'text-gray-300 hover:text-green-400'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-gray-300 hover:text-green-400 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              )}
            </svg>
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90">
            <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
                <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block w-full text-center px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer ${
                    activeSection === link.href.substring(1)
                    ? 'bg-green-900 text-green-300'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                }`}
                >
                {link.label}
                </a>
            ))}
            </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
