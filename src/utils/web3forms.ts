export interface Web3FormResult {
  success: boolean;
  message: string;
}

export async function submitToWeb3Forms(data: Record<string, any>): Promise<Web3FormResult> {
  try {
    const formData = new FormData();
    
    // Add access key from environment variable
    formData.append("access_key", import.meta.env.VITE_WEB3_FORMS_API_KEY);
    
    // Add all data fields to the form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    
    return {
      success: result.success,
      message: result.success ? "Form submitted successfully" : result.message || "An error occurred"
    };
  } catch (error) {
    console.error("Web3Forms submission error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}
