import React from 'react'
import Navbar from './Navbar'

const WishList = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wish List</h1>
        <p className="text-lg text-gray-600">Here you can manage your saved destinations.</p>
        {/* Future implementation for displaying and managing wish list items */}
      </div>
    </div>
  )
}

export default WishList
