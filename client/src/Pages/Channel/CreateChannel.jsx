import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function CreateChannel() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [formData, setFormData] = useState({
    channelName: "",
    handleName: "",
    description: "",
    channelBanner: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // ================= CREATE CHANNEL =================

 const validate = () => {
  const newErrors = {};

  if (!formData.channelName.trim()) {
    newErrors.channelName = "Channel name is required";
  }

  if (!formData.handleName.trim()) {
    newErrors.handleName = "Handle name is required";
  }

  if (!formData.description.trim()) {
    newErrors.description = "Description is required";
  }

  if (!formData.channelBanner.trim()) {
    newErrors.channelBanner = "Channel banner is required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/channel/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const oldUser = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...oldUser,
      channel: response.data.channel,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setErrors({});

    navigate("/my-channel");
  } catch (error) {
    console.log(error);

    setErrors({
      apiError:
        error?.response?.data?.message ||
        "Something went wrong",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

        {/* TITLE */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Your Channel
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            Start uploading videos and grow your audience
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CHANNEL NAME */}
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Channel Name
              </label>

              <input
                type="text"
                name="channelName"
                value={formData.channelName}
                onChange={handleChange}
                className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.channelName
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                  }`}
              />

              {errors.channelName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.channelName}
                </p>
              )}
            </div>

            {/* HANDLE NAME */}
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Handle Name
              </label>

              <input
                type="text"
                name="handleName"
                value={formData.handleName}
                onChange={handleChange}
                className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.handleName
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-white"
                  }`}
              />

              {errors.handleName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.handleName}
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white outline-none resize-none transition ${errors.description
                  ? "border-red-500"
                  : "border-zinc-700 focus:border-white"
                }`}
            />

            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* BANNER URL */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Channel Banner URL
            </label>

            <input
              type="text"
              name="channelBanner"
              value={formData.channelBanner}
              onChange={handleChange}
              className={`w-full h-12 px-4 bg-zinc-800 border rounded-xl text-white outline-none transition ${errors.channelBanner
                  ? "border-red-500"
                  : "border-zinc-700 focus:border-white"
                }`}
            />

            {errors.channelBanner && (
              <p className="text-red-500 text-xs mt-1">
                {errors.channelBanner}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
              flex-1 h-12
              rounded-xl
              bg-zinc-800 text-white
              hover:bg-zinc-700
              transition
            "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
              flex-1 h-12
              bg-white text-black
              rounded-xl
              font-semibold
              hover:bg-zinc-200
              transition
              disabled:opacity-50
            "
            >
              {loading
                ? "Creating..."
                : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;