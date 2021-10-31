import { useMediaQuery } from 'react-responsive'

export const useResponsive = () => {
  const isLg = useMediaQuery({ minWidth: 1024 })
  const isMd = useMediaQuery({ minWidth: 768 })
  const isSm = useMediaQuery({ minWidth: 640 })
  const isXs = useMediaQuery({ minWidth: 576 })
  return {
    isLg,
    isMd,
    isSm,
    isXs,
  }
}
