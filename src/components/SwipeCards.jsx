import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SwipeCards = ({ userAge, userGender, isPro, onShowPaywall }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);

  const fetchClothes = async () => {
    // 1. לוגיקה לפי מגדר וגיל
    let category = userGender === 'female' ? 'ladies_all' : 'men_all';
    if (userAge < 25) {
      category = userGender === 'female' ? 'ladies_divided' : 'men_divided';
    } else if (userAge > 40) {
      category = userGender === 'female' ? 'ladies_classics' : 'men_classic';
    }

    // 2. רנדומליות - בחירת עמוד רנדומלי (1-50)
    const randomPage = Math.floor(Math.random() * 50) + 1;

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
      setCards(prev => [...prev, ...(data.results || [])]);
    } catch (error) {
      console.error("Error fetching clothes:", error);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, [userGender, userAge]);

  const handleSwipe = (direction) => {
    const newCount = swipeCount + 1;
    setSwipeCount(newCount);

    // 3. הגבלה למשתמשים בחינם (Paywall)
    if (newCount >= 30 && !isPro) {
      onShowPaywall();
      return;
    }

    setCurrentIndex(prev => prev + 1);

    // טעינת בגדים נוספים כשמתקרבים לסוף הרשימה
    if (currentIndex > cards.length - 5) {
      fetchClothes();
    }
  };

  if (cards.length === 0) return <div className="loading">Finding your vibe...</div>;

  return (
    <div className="card-container" style={{ position: 'relative', height: '500px', width: '100%' }}>
      <AnimatePresence>
        {cards.map((card, index) => (
          index === currentIndex && (
            <motion.div
              key={`${card.code}-${index}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) handleSwipe('right');
                if (info.offset.x < -100) handleSwipe('left');
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: direction === 'right' ? 500 : -500, opacity: 0 }}
              style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid #333'
              }}
            >
              <img 
                src={card.images[0]?.url} 
                alt={card.name} 
                style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>{card.name}</h3>
                <p style={{ color: '#007BFF', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ₪{card.price.value}
                </p>
                <button 
                  onClick={() => window.open(`https://hm.com{card.code}.html`, '_blank')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  BUY NOW
                </button>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SwipeCards;

