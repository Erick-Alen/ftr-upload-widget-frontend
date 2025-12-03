import { UploadWidget } from './components/upload-widget';

export function App() {
  console.log('asdfgasdkjlfdshgfjkasdfhsffdasafdsafds')
  return (
    // dynamic viewport height
    <main className="flex h-dvh flex-col items-center justify-center p-10">
      <UploadWidget />
    </main>
  );
}
