import { redirect } from 'next/navigation';

// About now lives on the combined About & contact page
export default function AboutPage() {
  redirect('/contact#about');
}
