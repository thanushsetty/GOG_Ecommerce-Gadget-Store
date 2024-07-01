const initialState = {
    products: [],
};



const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: [...state.products, action.payload],
            };
        case 'DELETE_PRODUCT':
            const updatedProducts = state.products.filter(product => product.id !== action.payload);
            return {
                ...state,
                products: updatedProducts,
            };

        default:
            return state;
    }
};

export default productReducer;
