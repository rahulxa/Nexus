import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/features';
import About from "../components/About"
import Footer from '../components/Footer';

function Landing() {
    return (
        <div className="min-h-screen bg-black">
            <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(back2.jpg)' }}>
                <div className="backdrop-blur-sm bg-black bg-opacity-25 min-h-screen pt-24">
                    <Hero />
                    <Features />
                    <About />
                </div>
            </div>
        </div>
    );
}

export default Landing;