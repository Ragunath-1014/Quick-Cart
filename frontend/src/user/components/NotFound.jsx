import { Link } from "react-router-dom";

function NotFound({ image, alt, title, subTitle, path, pathName }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <img
                src={image}
                alt={alt}
                className="w-48"
            />

            <h1 className="text-xl font-semibold mt-4">
                {title}
            </h1>

            <p className="text-sm text-center mx-1 mt-1">
                {subTitle}
            </p>

            <Link
                to={path}
                className="mt-5 text-rose-500 
                font-semibold border-2 
                border-rose-500 rounded-md 
                px-6 py-3"
            >
                {pathName}
            </Link>
        </div>
    );
}

export default NotFound;