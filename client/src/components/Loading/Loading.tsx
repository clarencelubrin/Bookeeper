import { createPortal } from 'react-dom';
const loadingRoot = document.querySelector('#root') as HTMLElement;

function Loading() {
  return (
    <>
    {createPortal(
    <div className='absolute inset-0 flex items-center justify-center bg-white'>
      <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status" style={{color: '#f472b6'}}>
        <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>,
    loadingRoot
    )}
    </>
  );
}

export default Loading
