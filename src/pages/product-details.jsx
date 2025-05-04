import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { productAPI } from "../services/api";
import GlobalLoader from "../components/GlobalLoader";
import { clearLoading, setLoading } from "../store/loadingSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(setLoading({ isLoading: true, message: "Loading Products..." }));

    productAPI.getProductById(id).then((response) => {
      setProduct(response.data);
      dispatch(clearLoading());
    });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const isInCart = items.some((item) => item.id === product.id);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              {Array.isArray(product.images) && product.images.length > 0 ? (
                <div className="relative w-full h-96">
                  <img src={product.images[activeImage] || product.images[0]} alt={product.title} className="w-full h-96 object-cover rounded-lg" />
                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        &#8592;
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="mt-2 text-2xl font-semibold text-indigo-600">${product.price}</p>
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Category</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {product.category.name}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                {isAuthenticated ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isInCart ? "Already in Cart" : "Add to Cart"}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Login to Add to Cart
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
