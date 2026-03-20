const categories = [
  "All",
  "Productivity",
  "Development",
  "Research",
  "Creative"
];

function Categories({ selected, setSelected }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${
            selected === cat ? "active" : ""
          }`}
          onClick={() => setSelected(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default Categories;