const CATEGORIES = [
  "Nature",
  "Architecture",
  "Travel",
  "Animals",
  "Technology",
  "Food",
  "People",
  "Abstract",
  "Space",
  "Cars",
];

function CategoryTags({ activeCategory, onCategoryClick }) {
  return (
    <div className="categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`categories__tag ${
            activeCategory?.toLowerCase() === cat.toLowerCase()
              ? "categories__tag--active"
              : ""
          }`}
          onClick={() => onCategoryClick(cat.toLowerCase())}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTags;
