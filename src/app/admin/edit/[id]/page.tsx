import { Metadata } from 'next';
import EditClient from './EditClient';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Editare anunț',
  };
}

export default function Page({ params }: Props) {
  return <EditClient carId={params.id} />;
} 