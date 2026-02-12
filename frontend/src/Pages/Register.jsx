import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    if (
      user.fullName.length === 0 ||
      user.username.length === 0 ||
      user.email.length === 0 ||
      user.password.length === 0 ||
      !user.avatar
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [user]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const toastId = toast.loading("Registering user...");

  try {
    setLoading(true);
    setButtonDisabled(true);

    const formData = new FormData();

    formData.append("fullName", user.fullName);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("avatar", user.avatar);
    formData.append("coverImage", user.coverImage);

    const response = await axios.post(
      "/api/v1/users/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(response.data.message, { id: toastId });

    setLoading(false);

    setTimeout(() => {
      navigation("/login", { replace: true });
    }, 1000);

  } catch (error) {
    setButtonDisabled(false);
    setLoading(false);

    toast.error(
      error.response?.data?.message || "Registration failed",
      { id: toastId }
    );
  }
};


  return (
    <div className="flex items-center h-screen justify-center px-4">
      <div className="text-center p-8 rounded-xl bg-[#151515] shadow-2xl shadow-black w-full max-w-3xl">
        <h1 className="font-extrabold text-4xl mb-8">
          Registration Form
        </h1>

        <form className="font-mono p-5 mb-2">

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={user.fullName}
              onChange={(e) =>
                setUser({ ...user, fullName: e.target.value })
              }
              className="shadow-md outline-none shadow-black p-3 rounded-lg"
            />

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
              className="shadow-md outline-none shadow-black p-3 rounded-lg"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="shadow-md outline-none shadow-black p-3 rounded-lg"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
              className="shadow-md outline-none shadow-black p-3 rounded-lg"
            />

            {/* Avatar */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm text-zinc-400">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={(e) =>
                  setUser({
                    ...user,
                    avatar: e.target.files[0],
                  })
                }
                className="shadow-md outline-none cursor-pointer shadow-black p-2 rounded-lg text-sm"
              />
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-sm text-zinc-400">
                Cover Image
              </label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) =>
                  setUser({
                    ...user,
                    coverImage: e.target.files[0],
                  })
                }
                className="shadow-md outline-none cursor-pointer shadow-black p-2 rounded-lg text-sm"
              />
            </div>

          </div>

          {/* Register Button */}
          <button
            disabled={buttonDisabled}
            onClick={handleSubmit}
            className={`${
              buttonDisabled
                ? "bg-gray-600 hover:cursor-not-allowed"
                : "bg-[#ae7aff] hover:bg-[#9f65fd]"
            } p-3 rounded-lg cursor-pointer transition-all duration-300 shadow-xl shadow-black w-full mt-8`}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <span>
          Already have an account ?{" "}
          <Link
            to={"/login"}
            className="text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
