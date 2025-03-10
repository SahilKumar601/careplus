import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

type FileUploadProps={
    files:File[]
    onChange:(files:File[]) => void
}

const FileUploder=({files,onChange}:FileUploadProps)=> {
  const onDrop = useCallback((acceptedFiles : File[]) => {
    onChange(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files.length>0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt='uploaded document'
          className='max-h-[400px] overflow-hidden object-cover'
        /> 
      ): (
        <>
          <Image 
            src='/assets/icons/upload.svg'
            alt='upload icon'
            height={40}
            width={40}
          />
          <div className='file-upload_label'>
            <p className='text-14-regular'>
            <span className='text-green-500'>
              Click to upload
            </span>  or Drag 'n' drop
            </p>
            <p>
              PNG,JPG,SVG or GIF (max 800x400)
            </p>
          </div>
        </>
      )}
    </div>
  )
}
export default FileUploder;