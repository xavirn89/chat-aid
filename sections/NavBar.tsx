import React from 'react'

const NavBar = () => {
  return (
    <div className='flex w-full max-w-7xl h-fit mx-auto justify-between py-4'>
      <p>Logo</p>
      <div className='flex gap-4'>
        <p>Home</p>
        <p>Sign In</p>
        <p>Sign Up</p>
      </div>
    </div>
  )
}

export default NavBar