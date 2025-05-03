import FoodCard from './FoodCard';

const FoodGrid = ({ items, addToOrder }) => {
  return (
    <div className="food-grid">
      {items.map(item => (
        <FoodCard 
          key={item.id} 
          item={item} 
          addToOrder={addToOrder}
        />
      ))}
      <style jsx>{`
        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }
        
        @media (max-width: 768px) {
          .food-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default FoodGrid;
