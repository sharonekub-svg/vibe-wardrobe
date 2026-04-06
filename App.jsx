<div className="vibe-sidebar">
  <h3>Categories</h3>
  <button onClick={() => updateCategory('tshirts')}>T-Shirts</button>
  <button onClick={() => updateCategory('shoes')}>Shoes</button>
  <button onClick={() => updateCategory('jackets')}>Jackets</button>

  {/* קטגוריות שנעולות למנויים בלבד */}
  <div className="premium-section">
    <p>Premium Vibes 🔒</p>
    <button className="lock-btn" onClick={() => checkSubscription('luxury')}>Luxury Brands</button>
    <button className="lock-btn" onClick={() => checkSubscription('trending')}>Trending Now</button>
  </div>
</div>
