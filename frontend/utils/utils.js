import Cookies from "js-cookie";

export const base_url = "https://lazmina-backend-test.vercel.app/api";

export const logOut = async () => {
  try {
    // Remove the token cookie
    Cookies.remove("token");

    // Optional: redirect to login page
    window.location.href = "/login";

    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
