import type { FC, ReactNode } from 'react'
import { memo } from 'react'

import ReactModal from 'react-modal'

type Props = {
  children: ReactNode
  contentLabel: string
  isOpen: boolean
  onClose: () => void
  closeButton?: boolean
  onAfterClose?: () => void
}

ReactModal.setAppElement('#root')

export const Modal: FC<Props> = memo((props) => {
  const { children, contentLabel, isOpen, onClose, closeButton = false, onAfterClose } = props
  return (
    <ReactModal
      contentLabel={contentLabel}
      isOpen={isOpen}
      className="absolute top-1/2 left-1/2 right-auto bottom-auto -translate-x-1/2 -translate-y-1/2 border-1 border-indigo-400 bg-white text-gray-800 overflow-auto rounded-lg outline-none w-11/12 sm:w-2/3 md:w-1/2 max-h-128"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-50"
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false} // true モーダル外をクリックするとモーダルが閉じる
      onAfterClose={onAfterClose}
    >
      <div className={closeButton ? 'pt-0 pb-8' : 'py-8'}>
        {closeButton && (
          <div className="inline-block relative left-full -translate-x-full">
            <button type="button" className="relative right-2 top-2" onClick={onClose}>
              <svg className="w-8 h-8 text-gray-500 hover:text-gray-800">
                <use xlinkHref="#x" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </ReactModal>
  )
})
