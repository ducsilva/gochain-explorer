export const GET_SIGNER_LIST_REQUEST = "GET_SIGNER_LIST_REQUEST";
export const GET_SIGNER_LIST_SUCCESS = "GET_SIGNER_LIST_SUCCESS";
export const GET_SIGNER_LIST_FAILED = "GET_SIGNER_LIST_FAILED";

export const getSignerList = (payload: any) => ({
  type: GET_SIGNER_LIST_REQUEST,
  payload,
});

export const getSignerListSuccess = (data: any) => {
  return {
    type: GET_SIGNER_LIST_SUCCESS,
    data,
  };
};

export const getSignerListFailed = (error: any) => ({
  type: GET_SIGNER_LIST_FAILED,
  error,
});
