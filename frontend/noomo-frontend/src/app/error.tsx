'use client';

const Error = ({ error, reset }: { error: Error; reset: () => void })=> {

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <a className="kalnia-title text-[32px]">Hum, something is not right ?</a>
      <a className="kalnia-main text-[28px]">Error : {error.message}</a>
      <a className="kalnia-main text-[10px]">Don't worry, it's probably a feature and totally not a bug</a>
    </div>
  );
}

export default Error
