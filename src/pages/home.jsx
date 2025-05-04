import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { setCurrentPage, resetPagination, selectPaginatedProducts, setCategories, setProducts } from "../store/productSlice";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import { setLoading, clearLoading } from "../store/loadingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [productQuantities, setProductQuantities] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const observer = useRef();
  const loadingRef = useRef(false);

  const { products, hasMore, filteredProducts } = useSelector((state) => selectPaginatedProducts(state, selectedCategories));
  const currentPage = useSelector((state) => state.products.pagination.currentPage);
  useEffect(() => {
    dispatch(setLoading({ isLoading: true, message: "Loading Products..." }));
    productAPI
      .getCategories()
      .then((categoriesResponse) => {
        dispatch(setCategories(categoriesResponse.data));
        return productAPI.getAllProducts();
      })
      .then((productsResponse) => {
        dispatch(setProducts(productsResponse.data));
        dispatch(clearLoading());
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(clearLoading());
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetPagination());
  }, [selectedCategories, dispatch]);
  useEffect(() => {
    const updated = { ...activeImageIndex };
    let changed = false;
    products.forEach((product) => {
      if (product.images && product.images.length > 0 && !(product.id in updated)) {
        updated[product.id] = 0;
        changed = true;
      }
    });
    if (changed) {
      setActiveImageIndex(updated);
    }
  }, [products]);

  const lastProductElementRef = useCallback(
    (node) => {
      if (loadingRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadingRef.current = true;
            dispatch(setCurrentPage(currentPage + 1));
            loadingRef.current = false;
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, dispatch, currentPage]
  );

  const handleAddToCart = (product) => {
    const quantity = productQuantities[product.id] || 1;
    dispatch(addToCart({ ...product, quantity }));
    setProductQuantities({ ...productQuantities, [product.id]: 1 });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      setProductQuantities({ ...productQuantities, [productId]: newQuantity });
    }
  };

  const handleCategoryToggle = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories((prev) => {
        const newCategories = prev.filter((c) => c !== "All");
        if (newCategories.includes(category)) {
          return newCategories.filter((c) => c !== category);
        } else {
          return [...newCategories, category];
        }
      });
    }
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleImageChange = (productId, direction) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find((p) => p.id === productId);
      if (!product || !product.images || product.images.length <= 1) return prev;

      const maxIndex = product.images.length - 1;
      let newIndex;

      if (direction === "next") {
        newIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
      }

      return { ...prev, [productId]: newIndex };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-999">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">E-Commerce Store</h1>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleCategoryToggle("All")}
              className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                selectedCategories.includes("All") ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm font-medium">All</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.name)}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
                  selectedCategories.includes(category.name) ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  ref={index === products.length - 1 && hasMore ? lastProductElementRef : null}
                  className="bg-white rounded-lg shadow overflow-hidden transform transition-transform hover:scale-105"
                >
                  <div className="relative h-64 overflow-hidden">
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          title="Previous image"
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageChange(product.id, "prev");
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-indigo-600 hover:bg-opacity-80 transition-colors z-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      </>
                    )}
                    <Link to={`/product/${product.id}`} className="block h-full">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[activeImageIndex[product.id] || 0]
                            : product.category?.image || "https://via.placeholder.com/300"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          title="Next image"
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageChange(product.id, "next");
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-indigo-600 hover:bg-opacity-80 transition-colors z-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{product.category?.name || "Uncategorized"}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.title || "Untitled Product"}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description || "No description available"}</p>
                    <div className="mt-4">
                      <span className="text-lg font-bold text-gray-900">${product.price || 0}</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(product.id, (productQuantities[product.id] || 1) - 1);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{productQuantities[product.id] || 1}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuantityChange(product.id, (productQuantities[product.id] || 1) + 1);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching the selected categories.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
