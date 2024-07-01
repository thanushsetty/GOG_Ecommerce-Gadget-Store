export const addProduct = (productData) => {
    return {
        type: 'ADD_PRODUCT',
        payload: productData,
    };
};

export const deleteProduct = (productId) => {
    return {
        type: 'DELETE_PRODUCT',
        payload: productId,
    };
};