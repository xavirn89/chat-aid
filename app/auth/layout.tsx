import React from 'react'

const AuthLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className='flex w-full h-full justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout