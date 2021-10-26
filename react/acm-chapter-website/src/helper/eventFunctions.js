import categories from "../assets/data/categories";

function categoryFinder(eventName) {
  const lowerName = eventName.toLowerCase();
  categories.forEach((category) => {
    if (lowerName.includes(category)) {
      return category;
    }
  });
}

export { categoryFinder };
