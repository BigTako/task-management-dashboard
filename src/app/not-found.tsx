import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-sandy-light text-sandy-dark flex min-h-full w-full flex-col items-center justify-center gap-3">
      <h1 className="text-[36px]">Not found – 404! :(</h1>
      <Link className="border-sandy-dark rounded-full border-[1px] p-3" href="/">
        Go back to Home 🏠
      </Link>
    </div>
  );
}
