'use client'
import Header from '@/components/ui/header';
import '@/styles/common.css'
import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

export default function App() {
  const upload = useRef(null)
  const [image, setImage] = useState(null)
  const [base64Img, setBase64Img] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleImageUpload = () => {
    upload.current.click()
  }
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const base64File = await fileToBase64(file)
    setBase64Img(base64File)
    const compressedFile = await compressFile(file)
    setImage(compressedFile)
    reset()
  }
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(file)
    })
  }
  const compressFile = async (file) => {
    const options = {
      maxSizeMB: 4.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  }
  const handleAnalyze = async () => {
    reset()
    if (!image) {
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('image', image)
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const res = await resp.json()
      if (res.code === 200) {
        setDesc(res.data)
      } else {
        setError(res.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const reset = () => {
    setDesc('')
    setError('')
  }
  return (
    <div>
      <Header></Header>
      <main className='px-4'>
        <div className='my-4 mx-auto max-w-sm text-center'>
          <h2 className='font-bold text-2xl mb-2'>酷客</h2>
          <p className='mb-2'>我知道你吃了什么！</p>
          <div className='w-full h-auto p-6 pb-0 border rounded-md'>
            <input className='hidden' type='file' onChange={handleFileUpload} ref={upload} />
            {
              image ?
              <img className='w-full aspect-square object-cover' src={base64Img} /> :
              <div className='w-full aspect-square flex justify-center items-center'>
                <ImageIcon></ImageIcon>
              </div>
            }
            {
              error ? <p className='text-red-500 mt-2'>{error}</p> : desc && <p className='mt-2'>{desc}</p>
            }
            <UploadIcon className="mx-auto w-10 h-10 p-2 cursor-pointer hover:bg-slate-100" onClick={handleImageUpload}></UploadIcon>
          </div>
          <button
            className={`w-full py-2 bg-black text-white rounded-md mt-4 ${loading && 'pointer-events-none opacity-60'}`}
            onClick={handleAnalyze}
          >{ loading ? '分析中...' : '分析' }</button>
        </div>
      </main>
      <footer className='text-center text-slate-500 mb-2'>
        Copyright &copy; 2024 Mark Peng
      </footer>
    </div>
  );
}

function ImageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}