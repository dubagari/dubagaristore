import {Routes, Route} from 'react-router-dom'
import { Cart, Home, Login, OrderSuccess, ProductDeatails, Shop, Signup, Orders, Wishlist } from '../pages'
import CkechOut from '../pages/CkechOut'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchCart } from '../store/slice/cartThunks';
import { fetchWishlist } from '../store/slice/wishlistThunks';
import Success from '../pages/Success';



const Routers = () => {

   const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo?.token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/shop/:id' element={<ProductDeatails/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/checkout' element={<CkechOut />} />
        <Route path='/success' element={<Success />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
    </>
  )
}

export default Routers
