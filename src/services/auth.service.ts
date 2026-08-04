import requests from "@/lib/httpServices";

const AuthService = {
  login: async (body : any) => {
    return requests.post("/webApi/index.php", body);
  },

  verifyOtp: async (body : any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export const updateUserProfile = async (userData: any) => {
  try {
    const formData = new FormData();

    // Core Fields
    formData.append("view", "profile_update");
    formData.append("userID", userData.userID);
    formData.append("deviceType", "Android");
    formData.append("userPhone", userData.userPhone);
    formData.append("userFirstName", userData.userFirstName);
    formData.append("userLastName", userData.userLastName);
    formData.append("userEmail", userData.userEmail);
    formData.append("userImage",userData.userImage);

    /**
     * LOGIC FIX:
     * If photo is a File object, send it as binary.
     * If photo is a string (existing URL), send it as a string.
     * This prevents the backend from resetting to a default image.
     */
    if (userData.photo instanceof File) {
      formData.append("userImage", userData.photo);
    } else if (typeof userData.photo === "string") {
      formData.append("userImage", userData.photo);
    }

    const data = await requests.post("/webApi/index.php", formData);
    return data;
  } catch (error) {
    console.error("Profile update service error:", error);
    throw error;
  }
};
export default AuthService;
