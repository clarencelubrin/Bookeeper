import React from 'react'
import '../css/App.css';

function Footer() {
  return (
    <footer className="bg-gray-50 p-4">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center ">
              Created by <a href="https://github.com/clarencelubrin" className="hover:underline">Clarence Lubrin</a>
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 sm:mt-0">
              <li>
                  If there is any bugs you want to report, contact me at <a href="mailto:culubrin@up.edu.ph" className="hover:underline font-medium">culubrin@up.edu.ph</a>
              </li>
          </ul>
      </div>
    </footer>
  )
}

export default Footer