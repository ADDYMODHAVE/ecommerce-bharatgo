import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const { isLoading, loadingMessage } = useSelector((state) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
        <p className="text-black text-lg font-medium">{loadingMessage || "Loading..."}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
