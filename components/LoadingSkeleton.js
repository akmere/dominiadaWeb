import React from 'react'
import '../styles/spinner.css'

export default function LoadingSkeleton() {
  return (
    <div className='spinner-container'>
    <div className='lds-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
