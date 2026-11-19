import { useEffect, useState } from 'react';
export default function ApiNotice() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const listener = (event: Event) => setMessage((event as CustomEvent<string>).detail);
    window.addEventListener('vcraft:api-error', listener);
    return () => window.removeEventListener('vcraft:api-error', listener);
  }, []);
  if (!message) return null;
  return <div role="alert" className="fixed bottom-4 left-4 right-4 z-[80] max-w-xl rounded border border-red-300 bg-red-50 p-4 text-sm text-red-900 shadow-lg">
    {message} <button onClick={() => setMessage('')} className="ml-4 underline">Đóng</button>
  </div>;
}
