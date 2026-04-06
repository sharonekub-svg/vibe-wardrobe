import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ name: '', age: '', gender: 'male', budget: '' });
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  // פונקציית טעינת בגדים רנדומלית לחלוטין
  const fetchClothes = async () => {
    const randomPage = Math.floor(Math.random() * 50) + 1; // רנדומליות!
    let category = user.gender === 'female' ? 'ladies_all' : 'men_all';
    if (user.age < 25) category = user.gender === 'female' ? 'ladies_divided' : 'men_divided';

    try {
      const response = await fetch(
        `https://rapidapi.com{category}&currentpage=${randomPage}&pagesize=30`,
        {
          headers: {
            'x-rapidapi-key': '6130703a68mshf0d7fcb5017b576p1d7e38jsn0722b534eee8',
            'x-rapidapi-host': '://rapidapi.com'
          }
        }
      );
      const data = await response.json();
      setCards(data.results || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (step === 2) fetchClothes(); }, [step]);

  const handleSwipe = () => {
    setSwipeCount(prev => {
      if (prev + 1 >= 30) setShowPaywall(true);
      return prev + 1;
    });
    setCurrentIndex(prev => prev + 1);
  };

  if (step === 1) return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', padding: '40px' }}>
      <h1>Vibe AI</h1>
      <input placeholder="Name" onChange={e => setUser({...user, name: e.target.value})} style={inputStyle} />
      <input placeholder="Age" type="number" onChange={e => setUser({...user, age: e.target.value})} style={inputStyle} />
      <select onChange={e => setUser({...user, gender: e.target.value})} style={inputStyle}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input placeholder="Monthly Budget (₪)" type="number" onChange={e => setUser({...user, budget: e.target.value})} style={inputStyle} />
      <button onClick={() => setStep(2)} style={btnStyle}>Find My Vibe</button>
    </div>
  );

  return (
    <div style={{ background: '#000', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* תפריט קטגוריות בצד */}
      <div style={sidebarStyle}>
        <button onClick={fetchClothes} style={sideBtn}>Randomize 🔄</button>
        <button onClick={() => setShowPaywall(true)} style={sideBtn}>Luxury 🔒</button>
      </div>

      <AnimatePresence>
        {cards[currentIndex] && !showPaywall && (
          <motion.div 
            key={cards[currentIndex].code}
            drag="x"
            onDragEnd={(e, info) => handleSwipe()}
            style={cardStyle}
          >
            <img src={cards[currentIndex].images[0].url} style={{ width: '100%', height: '70%', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <h3>{cards[currentIndex].name}</h3>
              <p style={{ color: '#007BFF' }}>₪{cards[currentIndex].price.value}</p>
              <button onClick={() => window.open(`https://hm.com{cards[currentIndex].code}.html`, '_blank')} style={btnStyle}>BUY NOW</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPaywall && (
        <div style={paywallStyle}>
          <h2>Vibe Pro 🔒</h2>
          <p>You've seen 30 vibes! Unlock unlimited random clothes for ₪29.90</p>
          <button onClick={() => window.open('https://stripe.com', '_blank')} style={btnStyle}>GET UNLIMITED VIBES</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '5px', border: 'none' };
const btnStyle = { width: '100%', background: '#007BFF', color: '#fff', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const cardStyle = { position: 'absolute', left: '10%', top: '10%', width: '80%', height: '70%', background: '#1a1a1a', borderRadius: '20px', color: '#fff' };
const paywallStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' };
const sidebarStyle = { position: 'fixed', left: 0, top: '20%', width: '100px', zIndex: 100 };
const sideBtn = { width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none', marginBottom: '5px', fontSize: '10px' };
