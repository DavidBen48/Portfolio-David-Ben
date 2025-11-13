import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ExperienceTimeline from './components/ExperienceTimeline';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-black min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-0">
        {/* You can add background effects here if desired, e.g., grid patterns or particles */}
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 md:px-8">
          <Hero />
          <About />
          <Projects />
          <ExperienceTimeline />
          <Chatbot />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
