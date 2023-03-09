import Head from 'next/head'
import { useEffect, useState } from "react";

interface HomeProps {
  data: any;
  title?: string;
}

export async function getServerSideProps(): Promise<{ props: HomeProps }> {
  const initialData = await fetch("http://localhost:8000/handler-initial-data").then(x => x.json());
  return { props: { data: initialData } };
}

export default function Home(props: HomeProps): JSX.Element {
  const [data, setData] = useState(props.data);
  const [ws, setWS] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const newWS = new WebSocket("ws://localhost:8000/handler")
    newWS.onerror = err => console.error(err);
    newWS.onopen = () => setWS(newWS);
    newWS.onmessage = msg => setData(JSON.parse(msg.data));
  }, []);
  
  return (
    <div >
      <Head>
        <title>OSS Docs</title>
        <meta name="description" content="Like Google Docs, but open source!"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <main >
        <h1 >
          {props.title || "Untitled Document"}
        </h1>
        <div>Data is: {JSON.stringify(data)}</div>
      </main>
    </div>
  );
}
