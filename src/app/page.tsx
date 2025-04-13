import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
      <div className="w-20 h-20 bg-primary rounded-full mb-6 flex items-center justify-center">
        <span className="text-3xl font-bold">K</span>
      </div>

      <h1 className="text-4xl font-bold mb-6 gradient-text">KnowScroll</h1>

      <p className="text-xl mb-8 max-w-lg">
        The guilt-free reel platform that makes you smarter with every swipe
      </p>

      <div className="max-w-md mb-8">
        <p className="text-text-secondary mb-4">
          Transform mindless scrolling into effortless learning with our multi-dimensional content experience.
        </p>

        <ul className="text-left mb-6 space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            <span>Swipe up/down to explore series</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            <span>Swipe left/right for alternate perspectives</span>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            <span>Discuss with friends in learning threads</span>
          </li>
        </ul>
      </div>

      <Link
        href="/feed"
        className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors"
      >
        Start Scrolling
      </Link>
    </div>
  )
}