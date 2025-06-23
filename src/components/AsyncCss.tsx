'use client'

import { useEffect } from 'react'

const PreloadStyle = ({ href }: { href: string }) => {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.onload = () => {
      link.rel = 'stylesheet'
    }

    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [href])

  return null
}

const AsyncCss = () => {
  return (
    <>
      <PreloadStyle href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
      <PreloadStyle href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css" />
      <noscript>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
        />
      </noscript>
    </>
  )
}

export default AsyncCss 