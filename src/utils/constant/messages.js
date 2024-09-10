import pkg from 'joi';
const { required } = pkg;
const generateMessage=(entity)=>({
    alreadyExist:`${entity} Already Exist`,
    notFound:`${entity} not Found`,
    failToCreate:` Fail To Create ${entity} `,
    failToUpdate:` Fail To Update  ${entity}`,
    successUpdate:`${entity} Update Successfully`,
    failToDelete:` Fail To Delete ${entity}  `,
    successDelete:`${entity} Delete Successfully`,
    successCreate:`${entity} Create Successfully`,
    notAuthorized:`${entity}Not Authorized`,
    verifiedSuccessfully:`${entity} Verified Successfully`,
     outOfStock:`${entity} out of stoke`,
     addSuccessfully:`${entity} add successfully`,
})

export const messages={
    category: generateMessage('category'),
    subCategory: generateMessage('subCategory'),
   brand: generateMessage('brand'),
   product: generateMessage('product'),
    file:{required:"file is required "},
    user:generateMessage('user'),
    review:generateMessage('review'),
    cart:generateMessage('cart'),
    coupon:generateMessage('coupon'),
    order:generateMessage('order'),
}