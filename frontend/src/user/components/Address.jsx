import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../api/axios";
import Loader from "../../shared/Loader";

function Address({ setAddressModal, editAddress, setAddressDetails }) {

    const [fullName, setFulName] = useState(editAddress?.fullName || "");
    const [mobileNo, setMobileNo] = useState(editAddress?.phone || "");
    const [pinCode, setPinCode] = useState(editAddress?.pincode || "");
    const [city, setCity] = useState(editAddress?.city || "");
    const [state, setState] = useState(editAddress?.state || "");
    const [addressLine, setAddressLine] = useState(editAddress?.addressLine || "");
    const [loading, setLoading] = useState(false);

    const saveAddress = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            if (editAddress) {
                const res = await api.put(`/address/${editAddress._id}`, {
                    fullName,
                    phone: mobileNo,
                    pincode: pinCode,
                    city,
                    state,
                    addressLine
                })

                setAddressDetails(res.data.address);
                setAddressModal(false);
                toast.dismiss();
                toast.success(res.data.message);
            }
            else {
                const res = await api.post("/address/addAddress", {
                    fullName,
                    phone: mobileNo,
                    pincode: pinCode,
                    city,
                    state,
                    addressLine
                });

                setAddressDetails(res.data.address);
                setAddressModal(false);
                toast.dismiss();
                toast.success(res.data.message);
            }
        }
        catch (err) {
            console.log(err);
            toast.dismiss();
            toast.error("Something went wrong");

        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader loadingMessage={editAddress ? "Updating address" : "Saving address"} />
    }

    return (
        <div
            className="fixed inset-0 
            flex justify-center 
            items-end sm:items-center
            z-50 bg-black/60"
        >
            <div
                className="w-full sm:w-[500px]
                md:w-[450px] rounded-t-2xl 
                sm:rounded-2xl bg-white 
                h-auto relative
                flex flex-col pr-1"
            >
                <div className="p-5">
                    <h1 className="font-semibold">
                        ENTER DELIVERY DETAILS
                    </h1>
                    <i
                        className="ri-close-line absolute top-4 right-4 text-xl cursor-pointer"
                        onClick={() => setAddressModal(false)}
                    />
                </div>

                <hr className="border-gray-300" />

                <form className="mt-6">
                    <div className="custom-scrollbar overflow-y-auto h-80">
                        <h2 className="sm:text-sm font-medium px-5">
                            CONTACT DETAILS
                        </h2>

                        <div className="flex flex-col items-center justify-center px-5 gap-4 mt-4">
                            <input
                                type="text"
                                required
                                placeholder="Name"
                                value={fullName}
                                className="outline-none sm:text-sm w-full border border-gray-300 rounded-md p-3"
                                onChange={(e) => setFulName(e.target.value)}
                            />
                            <input
                                type="text"
                                required
                                placeholder="Mobile No"
                                value={mobileNo}
                                className="outline-none sm:text-sm w-full border border-gray-300 rounded-md p-3"
                                onChange={(e) => setMobileNo(e.target.value)}
                            />
                        </div>

                        <h2 className="sm:text-sm font-medium mt-6 px-5">
                            ADDRESS
                        </h2>

                        <div className="flex flex-col items-center justify-center px-5 gap-4 mt-4">
                            <input
                                type="text"
                                required
                                placeholder="Pin Code"
                                value={pinCode}
                                className="outline-none sm:text-sm w-full border border-gray-300 rounded-md p-3"
                                onChange={(e) => setPinCode(e.target.value)}
                            />
                            <input
                                type="text"
                                required
                                placeholder="City"
                                value={city}
                                className="outline-none sm:text-sm w-full border border-gray-300 rounded-md p-3"
                                onChange={(e) => setCity(e.target.value)}
                            />
                            <input
                                type="text"
                                required
                                placeholder="State"
                                value={state}
                                className="outline-none sm:text-sm w-full border border-gray-300 rounded-md p-3"
                                onChange={(e) => setState(e.target.value)}
                            />
                            <textarea
                                className="w-full h-20 
                                border border-gray-300 
                                outline-none sm:text-sm 
                                p-2 rounded-md
                                "
                                value={addressLine}
                                onChange={(e) => setAddressLine(e.target.value)}
                                placeholder="Address (locality, building, street)"
                                required
                            />
                        </div>
                    </div>

                    <div className="h-20 flex justify-between items-center px-5 gap-4">
                        <button
                            className="border border-gray-400 
                            text-sm font-medium 
                            w-full py-3
                            rounded-md
                            "
                            onClick={() => setAddressModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="border border-rose-500 
                            text-sm font-medium 
                            w-full py-3
                            rounded-md
                            bg-rose-500 text-white
                            "
                            onClick={saveAddress}
                        >
                            <h1>
                                {editAddress ? "Update" : "Save"}
                            </h1>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Address;