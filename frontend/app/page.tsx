export default async function Home() {
  const {status} = await fetch("http://localhost:8000/status").then(x=> x.json());

  return (
    <div className='text-3xl font-extrabold underline'>
      Status is {status}
    </div>
  );
}