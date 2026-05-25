import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";

import api from "../../api/axios";
import Loader from "../../shared/Loader";

function Signup() {

    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await api.post("/auth/signup", { name, email, password });
            setUser(res.data.user);
            toast.dismiss();
            toast.success("Welcome to QuickCart!");
            navigate("/");
        }
        catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex flex-col justify-center items-center min-h-screen px-5">

            <h1 className="text-3xl sm:text-4xl font-bold text-center">
                Login to your <span className="text-rose-500">Q</span>uick Cart account.
            </h1>

            <form onSubmit={handleSignup} className="flex flex-col items-center gap-4 mt-10">
                <div className="border border-gray-300 w-80 sm:w-96 flex items-center p-4 rounded-3xl">
                    <input
                        type="text"
                        required
                        placeholder="Name"
                        className="outline-none w-full font-medium"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <i className="ri-id-card-fill text-lg" />
                </div>

                <div className="border border-gray-300 w-80 sm:w-96 flex items-center p-4 rounded-3xl">
                    <input
                        type="email"
                        required
                        placeholder="Email"
                        className="outline-none w-full font-medium"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <i className="ri-mail-fill text-lg" />
                </div>

                <div className="border border-gray-300 w-80 sm:w-96 flex items-center p-4 rounded-3xl">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        className="outline-none w-full font-medium"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i
                        className={`${showPassword ? "ri-eye-fill" : "ri-eye-off-fill"} text-lg cursor-pointer`}
                        onClick={() => setShowPassword(!showPassword)} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-80 sm:w-96 
                    py-5 rounded-full 
                    bg-rose-500 text-white 
                    font-medium mt-6 
                    disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-3">
                            <span>Signing up</span>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <span>
                            Signup
                        </span>
                    )}
                </button>
            </form>

            <div className="flex items-center gap-1 text-sm sm:text-base mt-4">
                <p>
                    Already have an account?
                </p>
                <Link
                    to={"/login"}
                    className="text-rose-500 font-semibold"
                >
                    Login
                </Link>
            </div>
        </section>
    );
}

export default Signup;