import { appName } from "@/lib/constants";

export default function Home() {
  return (
    <div className="py-3">
      <h1 className="text-2xl">{appName}</h1>
      <h2 className="py-5 px-5">Chats</h2>
    </div>
  );
}
