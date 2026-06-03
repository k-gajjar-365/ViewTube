export const extractApiPayload = (response) => response?.data?.data;

export const extractApiMessage = (response) =>
   response?.data?.message || "Request completed";

export const normalizePaginatedDocs = (payload) => ({
   docs: payload?.docs || [],
   page: payload?.page || 1,
   totalPages: payload?.totalPages || 1,
   totalDocs: payload?.totalDocs || 0,
   hasNextPage: Boolean(payload?.hasNextPage),
   hasPrevPage: Boolean(payload?.hasPrevPage),
});

export const normalizeArrayPayload = (payload) =>
   Array.isArray(payload) ? payload : [];

export const normalizeApiError = (error, fallbackMessage) => {
   if (error?.code === "ERR_CANCELED") {
      return error;
   }

   const message = error?.response?.data?.message || error?.message || fallbackMessage;
   const normalizedError = new Error(message);
   normalizedError.response = error?.response;
   normalizedError.code = error?.code;
   normalizedError.cause = error;
   return normalizedError;
};

export const withApiTryCatch = async (requestFn, fallbackMessage) => {
   try {
      return await requestFn();
   } catch (error) {
      throw normalizeApiError(error, fallbackMessage);
   }
};
