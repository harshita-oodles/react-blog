export class GetContent {
    static URL = `${process.env.REACT_APP_BASE_URL}/api/blogs/`;
    static REFRESH_URL = `${process.env.REACT_APP_BASE_URL}/api/token/refresh/`;
  
    // Retrieve token from local storage
    static getAuthToken() {
      const storedToken = localStorage.getItem("authToken");
      return storedToken ? JSON.parse(storedToken).access : null;
    }
  
    // Retrieve refresh token from local storage
    static getRefreshToken() {
      const storedToken = localStorage.getItem("authToken");
      return storedToken ? JSON.parse(storedToken).refresh : null;
    }
  
    // Save new tokens to local storage
    static saveAuthToken(access, refresh) {
      localStorage.setItem("authToken", JSON.stringify({ access, refresh }));
    }
  
    // Refresh token if expired
    static async refreshToken() {
      const refreshToken = GetContent.getRefreshToken();
      if (!refreshToken) {
        console.error("No refresh token found. Logging out.");
        GetContent.logoutUser();
        return null;
      }
  
      try {
        console.log("Refreshing access token...");
        const response = await fetch(GetContent.REFRESH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
  
        if (!response.ok) {
          console.error("Failed to refresh token. Logging out.");
          GetContent.logoutUser();
          return null;
        }
  
        const data = await response.json();
        console.log("Token refreshed:", data);
        GetContent.saveAuthToken(data.access, refreshToken);
        return data.access;
      } catch (error) {
        console.error("Error refreshing token:", error);
        GetContent.logoutUser();
        return null;
      }
    }
  
    // Logout user
    static logoutUser() {
      localStorage.removeItem("authToken");
      window.location.reload(); // Reload the page to reflect logout state
    }
  
    // Fetch blog details
    static async fetchBlog(id) {
      let token = GetContent.getAuthToken();
    
      try {
        console.log("Fetching blog ID:", id);
    
        let headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
    
        let response = await fetch(`${GetContent.URL}${id}/`, {
          method: "GET",
          headers: headers,
        });
    
        console.log("Response status:", response.status);
    
        // If the token is expired, try refreshing it
        if (response.status === 401 && token) {
          token = await GetContent.refreshToken();
          if (!token) return null;
    
          headers["Authorization"] = `Bearer ${token}`;
          response = await fetch(`${GetContent.URL}${id}/`, {
            method: "GET",
            headers: headers,
          });
    
          console.log("Response after refresh:", response.status);
        }
    
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched blog data:", data);
    
        return data;
      } catch (error) {
        console.error("Error fetching blog:", error);
        return null;
      }
    }
  
    // Fetch all blogs
    static async fetchAllBlogs() {
      let token = GetContent.getAuthToken();
      
      try {
        console.log("Fetching all blogs...");
        
        let headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
    
        let response = await fetch(GetContent.URL, {
          method: "GET",
          headers: headers,
        });
    
        console.log("Response status:", response.status);
    
        if (response.status === 401 && token) {
          token = await GetContent.refreshToken();
          if (!token) return [];
    
          headers["Authorization"] = `Bearer ${token}`;
          response = await fetch(GetContent.URL, {
            method: "GET",
            headers: headers,
          });
    
          console.log("Response after refresh:", response.status);
        }
    
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched blogs:", data);
    
        return data;
      } catch (error) {
        console.error("Error fetching all blogs:", error);
        return [];
      }
    }
    
  
    // Fetch blogs by category
    static async fetchAllBlogsByCategory(category) {
      let token = GetContent.getAuthToken();
    
      try {
        console.log(`Fetching blogs by category '${category}'...`);
        
        let headers = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
    
        let response = await fetch(`${GetContent.URL}?category=${category}`, {
          method: "GET",
          headers: headers,
        });
    
        console.log("Response status:", response.status);
    
        if (response.status === 401 && token) {
          token = await GetContent.refreshToken();
          if (!token) return [];
    
          headers["Authorization"] = `Bearer ${token}`;
          response = await fetch(`${GetContent.URL}?category=${category}`, {
            method: "GET",
            headers: headers,
          });
    
          console.log("Response after refresh:", response.status);
        }
    
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched category-wise blogs:", data);
    
        return data;
      } catch (error) {
        console.error("Error fetching blogs by category:", error);
        return [];
      }
    }
    
    // Fetch comments for a blog
    static async fetchComments(id) {
      try {
        const response = await fetch(`${GetContent.URL}${id}/comments`);
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    }
  }
  