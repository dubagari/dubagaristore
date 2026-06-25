import React from 'react'

import ProductCart from '../UI/ProductCart'
const Productlist = ({data}) => {
  return (
      <>
          {data.map((item, index) => (
               <ProductCart key={index} item={item} />
          ))}
    </>
  )
}

export default Productlist
