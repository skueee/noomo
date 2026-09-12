'use client';

const Error = ({ error, reset }: { error: Error; reset: () => void })=> {

  return (
    <div>
      <a className="kalnia-title text-[32px]">Hum, something is not right ?</a>
      <a className="kalnia-main text-[28px]">{error.message}</a>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

export default Error
