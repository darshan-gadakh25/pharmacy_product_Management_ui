// API utility functions and error handling

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      message: data.message || `Error: ${status}`,
      status,
      errors: data.errors || null,
    };
  } else if (error.request) {
    return {
      message: 'Network error. Check your connection.',
      status: 0,
      errors: null,
    };
  } else {
    return {
      message: error.message || 'Unexpected error occurred',
      status: 0,
      errors: null,
    };
  }
};

export const formatApiResponse = (response) => {
  return {
    data: response.data,
    success: true,
    message: response.message || 'Success',
  };
};

export const buildQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

export const validateResponse = (response) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }
  return response;
};