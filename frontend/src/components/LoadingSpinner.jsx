const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 page-bg">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
            <p className="text-gray-500 text-sm">{text}</p>
        </div>
    );
};

export default LoadingSpinner;