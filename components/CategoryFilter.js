const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="filter-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <style jsx>{`
        .category-filter {
          margin-bottom: 30px;
        }
        
        .category-filter h3 {
          margin-bottom: 15px;
        }
        
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .filter-btn {
          padding: 8px 16px;
          background: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background: var(--primary-color);
          color: #fff;
        }
        
        .filter-btn:hover:not(.active) {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
