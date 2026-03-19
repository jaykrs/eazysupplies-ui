// export const placeHolderImage = '/assets/images/placeholder/product.png';

export const placeHolderImage = process.env.API_PRD_URL ? process.env.API_PRD_URL + '/file?file=default-product.png' : 'https://api.eazysupplies.com/api/file?file=default-product.png';
